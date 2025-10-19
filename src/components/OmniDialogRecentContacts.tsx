import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type recentContactsItems = {
  image: string;
  label: string;
  href: string;
  contactId?: string;
};

type OmniDialogRecentContactsProps = {
  data: recentContactsItems[];
  onSelect?: (contactId: string) => void;
  selected?: string;
};

const OmniDialogRecentContacts = ({
  data: recentContacts,
  onSelect,
  selected,
}: OmniDialogRecentContactsProps) => {
  return (
    <>
      <div className="text-base font-bold text-omni-pitch-black font-manrope flex">
        <span className="flex-1">RECENT CONTACT</span>
        <div className="flex gap-2 items-center justify-center">
          <ChevronLeft className="size-4" />
          <ChevronRight className="size-4 text-omni-blue" />
        </div>
      </div>
      <div className="flex justify-between my-4">
        <Link href={"#"}>
          <div className="hover:text-omni-blue flex flex-col justify-center items-center gap-2 transition-all ease-in-out">
            <Plus className="size-12 p-4 bg-[#D9D9D9] rounded-full hover:bg-omni-blue hover:text-white" />
            <span className="font-medium text-xm">Add</span>
          </div>
        </Link>
        {recentContacts.map(({ image, label, href, contactId }: recentContactsItems) => (
          <div
            key={contactId || href}
            onClick={() => contactId && onSelect?.(contactId)}
            className={`cursor-pointer hover:text-omni-blue flex flex-col justify-center items-center gap-2 transition-all ease-in-out ${selected === contactId ? "text-omni-blue" : ""}`}
          >
            <div className={`size-12 rounded-full ${selected === contactId ? "ring-2 ring-omni-blue" : ""}`}>
              <Image src={image} width={100} height={100} alt={label} className="rounded-full" />
            </div>
            <span className="font-medium text-xs">{label}</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default OmniDialogRecentContacts;
