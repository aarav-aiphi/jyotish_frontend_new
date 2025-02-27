interface ChatMessageType {
  _id: string;
  sender: {
    _id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  type: string;
  replyTo?: ChatMessageType | null;
  reactions: { [userId: string]: string };
}

type DateDivider = {
  type: 'divider';
  label: string;
};

type GroupedMessage = ChatMessageType | DateDivider;

export const isDivider = (item: GroupedMessage): item is DateDivider => {
  return 'type' in item && item.type === 'divider';
};

export const groupMessagesByDate = (messages: ChatMessageType[]): GroupedMessage[] => {
    const groups: GroupedMessage[] = [];
    let currentDateGroup: string | null = null;
  
    messages.forEach((message) => {
      const date = new Date(message.createdAt);
      const today = new Date();
      const diffDays = Math.floor(
        (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
      );
  
      let groupLabel = '';
      if (diffDays === 0) {
        groupLabel = 'Today';
      } else if (diffDays === 1) {
        groupLabel = 'Yesterday';
      } else if (diffDays <= 7) {
        groupLabel = 'This Week';
      } else {
        groupLabel = date.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        });
      }
  
      if (groupLabel !== currentDateGroup) {
        groups.push({ type: 'divider', label: groupLabel });
        currentDateGroup = groupLabel;
      }
  
      groups.push(message);
    });
  
    return groups;
  };