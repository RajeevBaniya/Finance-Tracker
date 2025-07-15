import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-finance-cardBg">
      <div className="w-full max-w-md">
        <SignUp
          appearance={{
            elements: {
              formButtonPrimary:
                "bg-gradient-blue-purple hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600",
              card: "bg-white shadow-lg",
              formFieldLabel: "text-black",
              formFieldInput: "text-black",
              footerActionText: "text-black",
              footerActionLink: "text-blue-600 hover:text-blue-800",
              headerTitle: "text-black",
              headerSubtitle: "text-gray-600",
              socialButtonsBlockButton: "text-black border-gray-300",
              dividerText: "text-gray-600",
              formFieldAction: "text-blue-600",
              formFieldErrorText: "text-red-600",
              identityPreviewText: "text-black",
              identityPreviewEditButton: "text-blue-600",
            },
          }}
        />
      </div>
    </div>
  );
}
