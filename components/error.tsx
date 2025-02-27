import { Footer } from "./footer";
import { Header } from "./header";

export function Error() {
return (
      <div className="min-h-screen">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-red-600">Error: Please Try Again Latter</div>
        </div>
        <Footer />
      </div>
    );

}