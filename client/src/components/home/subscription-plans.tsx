import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

type PlanType = "basic" | "professional" | "enterprise";

interface PlanFeature {
  text: string;
}

interface PlanInfo {
  id: PlanType;
  name: string;
  description: string;
  price: number;
  features: PlanFeature[];
  isPopular?: boolean;
}

const plans: PlanInfo[] = [
  {
    id: "basic",
    name: "Basic",
    description: "Best for business students just starting out.",
    price: 29,
    features: [
      { text: "Access to 5 courses" },
      { text: "Basic course materials" },
      { text: "Email support" }
    ]
  },
  {
    id: "professional",
    name: "Professional",
    description: "Perfect for business students and local entrepreneurs.",
    price: 79,
    features: [
      { text: "Access to all courses" },
      { text: "Premium course materials" },
      { text: "Priority support" },
      { text: "Monthly webinars" }
    ],
    isPopular: true
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For established businesses with multiple team members.",
    price: 199,
    features: [
      { text: "Access for up to 5 team members" },
      { text: "All premium content" },
      { text: "Dedicated account manager" },
      { text: "Custom training sessions" }
    ]
  }
];

export function SubscriptionPlans() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const subscribeMutation = useMutation({
    mutationFn: async (data: { planType: PlanType; price: number }) => {
      // Calculate end date (1 month from now)
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);
      
      const subscriptionData = {
        planType: data.planType,
        price: data.price * 100, // Convert to cents
        endDate: endDate.toISOString()
      };
      
      const res = await apiRequest("POST", "/api/subscriptions", subscriptionData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/subscription"] });
      toast({
        title: "Subscription successful",
        description: "Thank you for subscribing to our service!"
      });
    },
    onError: (error) => {
      toast({
        title: "Subscription failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleSubscribe = (plan: PlanInfo) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to subscribe to a plan",
        variant: "default"
      });
      setLocation("/auth");
      return;
    }
    
    subscribeMutation.mutate({
      planType: plan.id,
      price: plan.price
    });
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Flexible Subscription Plans
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Choose the plan that works best for your learning goals
          </p>
        </div>

        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:grid-cols-3">
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className={`border rounded-lg shadow-sm divide-y divide-gray-200 ${
                plan.isPopular ? 'border-primary' : 'border-gray-200'
              }`}
            >
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900">{plan.name}</h2>
                <p className="mt-4 text-sm text-gray-500">{plan.description}</p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">${plan.price}</span>
                  <span className="text-base font-medium text-gray-500">/month</span>
                </p>
                <Button 
                  onClick={() => handleSubscribe(plan)}
                  className="mt-8 block w-full"
                  disabled={subscribeMutation.isPending}
                >
                  {subscribeMutation.isPending ? "Processing..." : "Subscribe"}
                </Button>
              </div>
              <div className="pt-6 pb-8 px-6">
                <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase">What's included</h3>
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex space-x-3">
                      <CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500" />
                      <span className="text-sm text-gray-500">{feature.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
