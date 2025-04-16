"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import { FiPhone, FiVideo, FiMic, FiMicOff, FiVideoOff, FiMonitor } from "react-icons/fi";
import Image from "next/image";
import { Socket } from "socket.io-client";

interface IncomingCall {
    callerId: string;
    callerName: string;
    callType: "audio" | "video";
    signalData: Peer.SignalData;
}

interface OutgoingCall {
    callType: "audio" | "video";
    recipientId: string;
}

interface User {
    _id: string;
    name: string;
}

interface Participant {
    _id: string;
    name: string;
    avatar: string;
}

interface CallUIProps {
    socket: Socket;
    user: User;
    participant: Participant;
    chatId: string;
    astrologerId: string;
}

export default function CallUI({
    socket,
    user,
    participant,

}: CallUIProps) {
    // State for call
    const [isCallActive, setIsCallActive] = useState(false);
    const [callType, setCallType] = useState<"audio" | "video" | null>(null);

    // Outgoing call request
    const [outgoingCall, setOutgoingCall] = useState<OutgoingCall | null>(null);

    // Incoming call data
    const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);

    // Peer refs
    const myVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const peerRef = useRef<Peer.Instance | null>(null);

    // Track the local media stream we're using
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);

    // Toggles
    const [isAudioMuted, setIsAudioMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);

    // ===========================
    // 1) Socket: Listen for calls
    // ===========================
    const closePeer = useCallback(() => {
        if (peerRef.current) {
            peerRef.current.destroy();
            peerRef.current = null;
        }
    
        if (localStream) {
            localStream.getTracks().forEach((track) => track.stop());
        }
        setLocalStream(null);
    
        if (myVideoRef.current?.srcObject) {
            (myVideoRef.current.srcObject as MediaStream)
                .getTracks()
                .forEach((track) => track.stop());
        }
        if (remoteVideoRef.current?.srcObject) {
            (remoteVideoRef.current.srcObject as MediaStream)
                .getTracks()
                .forEach((track) => track.stop());
        }
    
        setIsAudioMuted(false);
        setIsVideoOff(false);
        setIsScreenSharing(false);
    }, [localStream]);

    const endCall = useCallback((emitToRemote: boolean = true) => {
        setIsCallActive(false);
        setCallType(null);
        setIncomingCall(null);
        setOutgoingCall(null);
    
        if (emitToRemote && socket) {
            socket.emit("endCall", {});
        }
    
        closePeer();
    }, [socket, closePeer]); // Add closePeer to dependencies
    
    useEffect(() => {
        if (!socket) return;
    
        const handleIncomingCall = (data: IncomingCall) => {
            if (isCallActive) {
                socket.emit("rejectCall", { callerId: data.callerId });
            } else {
                setIncomingCall(data);
            }
        };
        socket.on("incomingCall", handleIncomingCall);
    
        const handleCallAccepted = (signalData: Peer.SignalData) => {
            console.log("Caller received `callAccepted` =>", signalData);
            if (peerRef.current) {
                peerRef.current.signal(signalData);
                setIsCallActive(true);
            }
        };
        socket.on("callAccepted", handleCallAccepted);
    
        const handleCallRejected = () => {
            endCall(false);
            alert("Call was rejected.");
        };
        socket.on("callRejected", handleCallRejected);
    
        const handleCallEnded = () => {
            console.log("Received 'callEnded' from remote side");
            endCall(false);
        };
        socket.on("callEnded", handleCallEnded);
    
        return () => {
            socket.off("incomingCall", handleIncomingCall);
            socket.off("callAccepted", handleCallAccepted);
            socket.off("callRejected", handleCallRejected);
            socket.off("callEnded", handleCallEnded);
        };
    }, [socket, isCallActive, endCall]);
    


    // ===========================
    // 2) Initiate Outgoing Call
    // ===========================
    const initiateCall = async (type: "audio" | "video") => {
        if (!socket || !participant || !participant._id) return;

        try {
            setOutgoingCall({
                callType: type,
                recipientId: participant._id,
            });

            // Get local media
            const stream = await navigator.mediaDevices.getUserMedia({
                video: type === "video",
                audio: true,
            });
            setLocalStream(stream);

            if (myVideoRef.current) {
                console.log("Setting local video source:", stream.id);
                myVideoRef.current.srcObject = stream;
                myVideoRef.current.play()
                    .then(() => console.log("Local video started playing"))
                    .catch(err => {
                        console.error("Error playing local video:", err);
                        // We don't need user interaction for local video (muted videos can autoplay)
                    });
            } else {
                console.warn("Local video ref is null");
            }

            // Create peer
            const peer = new Peer({
                initiator: true,
                trickle: false,
                stream,
                config: {
                    iceServers: [
                        { urls: "stun:stun1.l.google.com:19302" },
                        { urls: "stun:stun2.l.google.com:19302" },
                        { urls: "stun:stun3.l.google.com:19302" },
                        { urls: "stun:stun4.l.google.com:19302" },
                        { 
                            urls: 'turn:openrelay.metered.ca:80',
                            username: 'openrelayproject',
                            credential: 'openrelayproject'
                        },
                        {
                            urls: 'turn:openrelay.metered.ca:443',
                            username: 'openrelayproject',
                            credential: 'openrelayproject'
                        }
                    ],
                    iceCandidatePoolSize: 10,
                },
            });

            // Called when our local peer has signal data to send
            peer.on("signal", (data) => {
                socket.emit("callUser", {
                    recipientId: participant._id,
                    signalData: data,
                    callType: type,
                    callerName: user?.name || "Unknown",
                });
            });

            // Called when remote peer's stream arrives
            peer.on("stream", (remoteStream) => {
                console.log("Received remote stream:", remoteStream.id);
                if (remoteVideoRef.current) {
                    console.log("Setting remote video source");
                    remoteVideoRef.current.srcObject = remoteStream;
                    
                    // Force video to play with promise handling
                    remoteVideoRef.current.play()
                        .then(() => console.log("Remote video playing successfully"))
                        .catch(err => {
                            console.error("Error playing remote video:", err);
                            // Try again with user interaction
                            const playButton = document.createElement("button");
                            playButton.textContent = "Play Video";
                            playButton.onclick = () => {
                                remoteVideoRef.current?.play();
                                playButton.remove();
                            };
                            document.body.appendChild(playButton);
                        });
                } else {
                    console.warn("Remote video ref is null");
                }
            });

            // Optional debug
            peer.on("connect", () => {
                console.log("Peer connected successfully!");
                setIsCallActive(true);
            });
            
            peer.on("error", (err) => {
                console.error("Peer error (caller):", err);
                alert(`Call error: ${err.message}`);
                endCall(false);
            });

            peer.on("close", () => {
                console.log("Peer connection closed");
                endCall(false);
            });

            peer.on("iceStateChange", (state) => {
                console.log("ICE state changed to:", state);
                if (state === "disconnected" || state === "failed" || state === "closed") {
                    console.error("ICE connection failed");
                    endCall(false);
                }
            });

            peerRef.current = peer;
            setCallType(type);
        } catch (err) {
            console.error("Error initiating call:", err);
            setOutgoingCall(null);
        }
    };

    // ===========================
    // 3) Accept Incoming Call
    // ===========================
    const acceptCall = async () => {
        if (!incomingCall || !socket) return;
        const { callerId, callType, signalData } = incomingCall;

        try {
            setIncomingCall(null);
            setIsCallActive(true);
            setCallType(callType);

            // 1) Attempt full (video + audio) media if callType is "video"
            let stream;
            if (callType === "video") {
                try {
                    stream = await navigator.mediaDevices.getUserMedia({
                        video: true,
                        audio: true,
                    });
                } catch (error) {
                    if (
                        error instanceof Error &&
                        (error.name === "NotReadableError" || error.name === "NotFoundError")
                    ) {
                        console.warn("Camera in use or not found. Falling back to audio only.");
                        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                        // Optionally set a local state like `cameraAvailable=false` to show camera is off in UI
                    } else {
                        console.error("Error in getUserMedia:", error);
                        // Optionally reject or handle differently
                        socket.emit("rejectCall", { callerId });
                        return;
                    }
                }

            } else {
                // For audio-only call, just get audio
                stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            }

            setLocalStream(stream);

            // Attach your local stream to a <video> if needed (for self preview)
            if (myVideoRef.current) {
                console.log("Callee setting local video source:", stream.id);
                myVideoRef.current.srcObject = stream;
                myVideoRef.current.play()
                    .then(() => console.log("Callee: Local video started playing"))
                    .catch(err => {
                        console.error("Callee: Error playing local video:", err);
                        // We don't need user interaction for local video (muted videos can autoplay)
                    });
            } else {
                console.warn("Callee: Local video ref is null");
            }



            // 3) Create the peer in "callee" mode
            const peer = new Peer({
                initiator: false,
                trickle: false,
                stream,
                config: {
                    iceServers: [
                        { urls: "stun:stun1.l.google.com:19302" },
                        { urls: "stun:stun2.l.google.com:19302" },
                        { urls: "stun:stun3.l.google.com:19302" },
                        { urls: "stun:stun4.l.google.com:19302" },
                        { 
                            urls: 'turn:openrelay.metered.ca:80',
                            username: 'openrelayproject',
                            credential: 'openrelayproject'
                        },
                        {
                            urls: 'turn:openrelay.metered.ca:443',
                            username: 'openrelayproject',
                            credential: 'openrelayproject'
                        }
                    ],
                    iceCandidatePoolSize: 10,
                },
            });

            peer.on("signal", (data) => {
                socket.emit("answerCall", {
                    callerId,
                    signalData: data,
                });
            });

            peer.on("stream", (remoteStream) => {
                console.log("Callee received remote stream:", remoteStream.id);
                if (remoteVideoRef.current) {
                    console.log("Callee setting remote video source");
                    remoteVideoRef.current.srcObject = remoteStream;
                    
                    // Force video to play with promise handling
                    remoteVideoRef.current.play()
                        .then(() => console.log("Callee: Remote video playing successfully"))
                        .catch(err => {
                            console.error("Callee: Error playing remote video:", err);
                            // Try again with user interaction
                            const playButton = document.createElement("button");
                            playButton.textContent = "Play Video";
                            playButton.onclick = () => {
                                remoteVideoRef.current?.play();
                                playButton.remove();
                            };
                            document.body.appendChild(playButton);
                        });
                } else {
                    console.warn("Callee: Remote video ref is null");
                }
            });

            peer.on("error", (err) => {
                console.error("Callee peer error:", err);
                alert(`Call error: ${err.message}`);
                endCall(false);
            });

            peer.on("connect", () => {
                console.log("Callee peer connected successfully!");
                setIsCallActive(true);
            });

            peer.on("close", () => {
                console.log("Callee peer connection closed");
                endCall(false);
            });

            peer.on("iceStateChange", (state) => {
                console.log("Callee ICE state changed to:", state);
                if (state === "disconnected" || state === "failed" || state === "closed") {
                    console.error("Callee ICE connection failed");
                    endCall(false);
                }
            });

            // 4) Use the caller's signal to complete handshake
            peer.signal(signalData);

            peerRef.current = peer;
        } catch (err) {
            console.error("Error accepting call:", err);
            socket.emit("rejectCall", { callerId });
        }
    };


    // ===========================
    // 4) Reject / Cancel Call
    // ===========================
    const rejectCall = () => {
        if (!incomingCall || !socket) return;
        socket.emit("rejectCall", { callerId: incomingCall.callerId });
        setIncomingCall(null);
    };

    const cancelOutgoingCall = () => {
        if (!outgoingCall || !socket) return;
        socket.emit("rejectCall", { callerId: user?._id });
        setOutgoingCall(null);
        closePeer();
    };

    // ===========================
    // 6) Toggle Audio
    // ===========================
    const toggleAudio = () => {
        if (!localStream) return;

        localStream.getAudioTracks().forEach((track) => {
            track.enabled = !track.enabled;
        });
        setIsAudioMuted((prev) => !prev);
    };

    // ===========================
    // 7) Toggle Video
    // ===========================
    const toggleVideo = () => {
        if (!localStream) return;

        localStream.getVideoTracks().forEach((track) => {
            track.enabled = !track.enabled;
        });
        setIsVideoOff((prev) => !prev);
    };

    // ===========================
    // 8) Screen Sharing (Desktop)
    // ===========================
    const startScreenShare = async () => {
        if (!peerRef.current || !localStream) return;
        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
            });

            // Replace the video track in Peer with screen track
            const screenTrack = screenStream.getVideoTracks()[0];
            const videoTrack = localStream.getVideoTracks()[0];
            
            if (videoTrack && screenTrack) {
                peerRef.current.replaceTrack(
                    videoTrack,
                    screenTrack,
                    localStream
                );

                setIsScreenSharing(true);

                // Listen for user to stop share from browser UI
                screenTrack.onended = () => {
                    stopScreenShare();
                };
            }
        } catch (err) {
            console.error("Error starting screen share:", err);
        }
    };

    const stopScreenShare = async () => {
        if (!peerRef.current || !localStream) return;
        try {
            // Re-acquire camera
            const newCameraStream = await navigator.mediaDevices.getUserMedia({
                video: callType === "video",
                audio: true,
            });
            const newCameraTrack = newCameraStream.getVideoTracks()[0];

            // Replace the screen track with the camera track
            peerRef.current.replaceTrack(
                peerRef.current.streams[0].getVideoTracks()[0],
                newCameraTrack,
                peerRef.current.streams[0]
            );

            setIsScreenSharing(false);
        } catch (err) {
            console.error("Error stopping screen share:", err);
        }
    };

    return (
        <>
            {/* ========== Header ========== */}
            <div className="p-[14px] border-b flex items-center justify-between">
                <div>
                    {participant ? (
                        <div className="flex items-center">
                            <Image
                                src={participant.avatar}
                                alt="Avatar"
                                width={100}
                                height={100}
                                className="w-8 h-8 rounded-full object-cover mx-2"
                            />
                            <div>{participant.name}</div>
                        </div>
                    ) : (
                        <div>Unknown participant</div>
                    )}
                </div>
                <div className="flex space-x-4 justify-end">
                    <button
                        onClick={() => initiateCall("audio")}
                        className="p-2 rounded bg-gray-200 hover:bg-gray-300"
                    >
                        <FiPhone />
                    </button>
                    <button
                        onClick={() => initiateCall("video")}
                        className="p-2 rounded bg-gray-200 hover:bg-gray-300"
                    >
                        <FiVideo />
                    </button>
                </div>
            </div>

            {/* ========== Outgoing Call Overlay ========== */}
            {outgoingCall && !isCallActive && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 w-72 rounded shadow-md text-center">
                        <p className="text-xl font-semibold">Calling...</p>
                        <p className="text-sm mt-2">{participant?.name}</p>
                        <button
                            onClick={cancelOutgoingCall}
                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* ========== Incoming Call Overlay ========== */}
            {incomingCall && !isCallActive && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 w-72 rounded shadow-md text-center">
                        <p className="text-xl font-semibold">Incoming Call</p>
                        <p className="text-sm mt-2">
                            {incomingCall.callType === "video" ? "Video" : "Audio"} Call from{" "}
                            {incomingCall.callerName}
                        </p>
                        <div className="flex space-x-4 mt-4 justify-center">
                            <button
                                onClick={acceptCall}
                                className="bg-green-500 text-white px-4 py-2 rounded"
                            >
                                Accept
                            </button>
                            <button
                                onClick={rejectCall}
                                className="bg-red-500 text-white px-4 py-2 rounded"
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ========== Active Call UI ========== */}
            {isCallActive && (
                <div className="fixed bottom-4 right-4 bg-white p-3 shadow-lg border flex flex-col items-center z-50 rounded w-96">
                    <div className="flex w-full justify-center space-x-2 mb-2">
                        {/* Local video */}
                        {callType === "video" && (
                            <video
                                ref={myVideoRef}
                                autoPlay
                                muted
                                playsInline
                                className="w-40 h-32 bg-black rounded-lg"
                                onPlay={() => console.log("Local video started playing")}
                                onLoadedMetadata={() => console.log("Local video metadata loaded")}
                                onError={(e) => console.error("Local video error:", e)}
                            />
                        )}

                        {/* Remote video */}
                        {callType === "video" && (
                            <video
                                ref={remoteVideoRef}
                                autoPlay
                                playsInline
                                className="w-40 h-32 bg-black rounded-lg"
                                onPlay={() => console.log("Remote video started playing")}
                                onLoadedMetadata={() => console.log("Remote video metadata loaded")}
                                onError={(e) => console.error("Remote video error:", e)}
                            />
                        )}
                    </div>

                    {/* Audio-call placeholders if video is off */}
                    {callType === "audio" && (
                        <p className="text-sm text-gray-700 mb-2">Audio Call in progress...</p>
                    )}

                    <div className="flex space-x-2">
                        {/* Toggle Audio */}
                        <button
                            onClick={toggleAudio}
                            className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                        >
                            {isAudioMuted ? <FiMicOff /> : <FiMic />}
                        </button>

                        {/* Toggle Video (only if callType === "video") */}
                        {callType === "video" && (
                            <button
                                onClick={toggleVideo}
                                className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                {isVideoOff ? <FiVideoOff /> : <FiVideo />}
                            </button>
                        )}

                        {/* Screen Share (only if callType === "video") */}
                        {callType === "video" && (
                            <>
                                {!isScreenSharing ? (
                                    <button
                                        onClick={startScreenShare}
                                        className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                                        title="Share Screen"
                                    >
                                        <FiMonitor />
                                    </button>
                                ) : (
                                    <button
                                        onClick={stopScreenShare}
                                        className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                                        title="Stop Sharing"
                                    >
                                        <FiMonitor className="text-red-600" />
                                    </button>
                                )}
                            </>
                        )}

                        {/* End Call */}
                        <button
                            onClick={() => endCall(true)}
                            className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            End
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
