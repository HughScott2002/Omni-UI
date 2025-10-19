import { OmniBigBarChart } from "@/components/OmniBigBarChart";
import CandlestickChart from "@/components/OmniCandlestick";
import OmniInactiveDevelopment from "@/components/OmniInactiveDevelopment";

const page = () => {
  return (
    <section className="w-full h-full">
      {/* <OmniInactiveDevelopment /> */}
      <div className="size-full flex  flex-col justify-start items-center rounded-3xl overflow-hidden">
        <div className="w-full h-40 bg-omni-yellow">Hey</div>
        <div className="w-full h-[60%]">
          {/* <CandlestickChart /> */}
          <OmniBigBarChart />
        </div>
      </div>
    </section>
  );
};

export default page;
