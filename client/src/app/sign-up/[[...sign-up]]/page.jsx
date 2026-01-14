import { SignUp } from "@clerk/nextjs";
import { LineChart } from "lucide-react";

function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-finance-cardBg p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, #3B7DF1 1px, transparent 1px),
            linear-gradient(to bottom, #3B7DF1 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}></div>
      </div>
      
      <div className="absolute top-20 left-10 w-2 h-2 bg-finance-primary/30 rounded-full animate-float"></div>
      <div className="absolute top-40 right-20 w-3 h-3 bg-finance-primary/20 rounded-full animate-float-delayed"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="relative">
              <LineChart className="h-8 w-8 text-finance-primary" strokeWidth={2.5} />
              <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-finance-primary rounded-full"></div>
            </div>
            <span className="text-3xl font-bold text-white tracking-tight">
              FinTrack
            </span>
          </div>
        </div>

        <SignUp
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-white/[0.97] shadow-2xl border border-gray-200/50 backdrop-blur-xl rounded-2xl",
              formButtonPrimary:
                "bg-finance-primary hover:bg-finance-hover text-white normal-case font-semibold shadow-lg shadow-finance-primary/20 hover:shadow-xl hover:shadow-finance-primary/30 transition-all duration-300 rounded-xl py-3",
              formFieldLabel: "text-gray-700 font-medium text-sm",
              formFieldInput: "text-gray-900 bg-white border-gray-300 focus:border-finance-primary focus:ring-2 focus:ring-finance-primary/20 rounded-lg transition-all duration-200",
              footerActionText: "text-gray-600 text-sm",
              footerActionLink: "text-finance-primary hover:text-finance-hover font-semibold transition-colors",
              headerTitle: "text-gray-900 font-bold text-2xl",
              headerSubtitle: "text-gray-600 text-base",
              socialButtonsBlockButton: "text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 normal-case font-medium transition-all duration-200 rounded-lg",
              socialButtonsBlockButtonText: "text-gray-700 font-medium",
              dividerLine: "bg-gray-200",
              dividerText: "text-gray-500 text-sm font-medium",
              formFieldAction: "text-finance-primary hover:text-finance-hover font-medium transition-colors",
              formFieldErrorText: "text-red-600 text-sm",
              identityPreviewText: "text-gray-900",
              identityPreviewEditButton: "text-finance-primary hover:text-finance-hover transition-colors",
              formFieldInputShowPasswordButton: "text-gray-500 hover:text-gray-700 transition-colors",
              otpCodeFieldInput: "border-gray-300 text-gray-900 focus:border-finance-primary focus:ring-2 focus:ring-finance-primary/20 rounded-lg",
            },
          }}
        />
      </div>
    </div>
  );
}

export default SignUpPage;
