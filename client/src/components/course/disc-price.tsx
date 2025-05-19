
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Course } from "@shared/schema";

export function PricingSection({ course }: { course: Course }) {
  const [referralCode, setReferralCode] = useState("");

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: course.currency || "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(course.price);

  const formattedOriginalPrice = course.originalPrice 
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: course.currency || "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(course.originalPrice)
    : null;

  const discountPercentage = course.originalPrice
    ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
    : 0;

  return (
    <div className="space-y-4 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-center gap-4">
        <span className="text-2xl font-bold text-gray-900">{formattedPrice}</span>
        {course.originalPrice && course.originalPrice > course.price && (
          <>
            <span className="line-through text-gray-500 text-lg">
              {formattedOriginalPrice}
            </span>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Save {discountPercentage}%
            </Badge>
          </>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="referral" className="block text-sm font-medium text-gray-700">
          Have a referral code?
        </label>
        <Input
          id="referral"
          placeholder="Enter code"
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value)}
          className="max-w-xs"
        />
      </div>

      <Badge className="bg-red-100 text-red-700">🔥 Limited time offer</Badge>
    </div>
  );
}
