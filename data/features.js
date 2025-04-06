import { ShieldAlert, Eye, KeyRound, Trash2 } from "lucide-react"; // More relevant icons

export const features = [
  {
    icon: <ShieldAlert className="w-10 h-10 mb-4 text-primary" />,
    title: "Real-Time Data Breach Monitoring",
    description:
      "Get instant alerts if your email is found in a data breach. Stay one step ahead of identity theft and protect your sensitive information.",
  },
  {
    icon: <Eye className="w-10 h-10 mb-4 text-primary" />,
    title: "Track Your Data Footprint",
    description:
      "Easily see which apps have access to your personal data and understand your online exposure.  Take control of your digital identity.",
  },
  {
    icon: <KeyRound className="w-10 h-10 mb-4 text-primary" />,
    title: "Generate Secure, Disposable Identities",
    description:
      "Create fake names, emails, and other data to protect your real information when signing up for new services. Say goodbye to spam and unwanted tracking.",
  },
  {
    icon: <Trash2 className="w-10 h-10 mb-4 text-primary" />,
    title: "Take Back Control of Your Data",
    description: "Understand where your data is, who has access to it, and easily remove your information from online services.",
  },
];