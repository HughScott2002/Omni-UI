import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";

const AuthFooter = ({ type }: { type: string }) => {
  return (
    <footer className="flex flex-col items-center gap-1">
      <div className="text-center text-sm">
        <span className="text-omni-text-grey">
          {type === "login"
            ? "Don't have an account?"
            : "Already have an account?"}
        </span>
        <Link
          className="font-semibold text-omni-blue hover:text-omni-green"
          href={type === "login" ? "/register" : "/login"}
        >
          {type === "login" ? " Register" : " Login"}
        </Link>
      </div>

      {type === "register" && (
        <>
          <p className="px-8 text-center text-sm text-pretty  text-omni-text-grey my-2">
            By clicking continue, you agree to our{" "}
            <Link
              href="/terms"
              className="hover:text-omni-green underline underline-offset-4 text-omni-blue"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="hover:text-omni-green underline underline-offset-4 text-omni-blue"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </>
      )}
    </footer>
  );
};

export default AuthFooter;
