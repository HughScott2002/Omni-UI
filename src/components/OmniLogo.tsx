import Image from "next/image";

const OmniLogo = ({ size }: { size: number }) => {
  return (
    <Image
      src="/icons/Omni-Logo.svg"
      alt="Omni Logo"
      width={56}
      height={56}
      className={`size-${size}`}
    />
  );
};

export default OmniLogo;
