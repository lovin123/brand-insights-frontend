"use client";

import type React from "react";
import { useInsights } from "@/app/providers";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { BrandInsightsAPI } from "@/lib/api-client";

export default function HomePage() {
  const router = useRouter();
  const { setInsights, setLoading, loading, setError, error } = useInsights();
  const [formData, setFormData] = useState({
    brandName: "",
    brandWebsite: "",
    contactEmail: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.brandName.trim()) {
      newErrors.brandName = "Brand name is required";
    }

    if (!formData.brandWebsite.trim()) {
      newErrors.brandWebsite = "Brand website is required";
    } else if (!/^https?:\/\//.test(formData.brandWebsite)) {
      newErrors.brandWebsite = "Website must start with http:// or https://";
    }

    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = "Contact email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = "Please enter a valid email address";
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const insights = await BrandInsightsAPI.analyzeBrand(formData);
      setInsights(insights);
      router.push("/insights");
    } catch (error) {
      let message = "An error occurred";
      if (error instanceof Error) {
        message = error.message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof typeof formData
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Brand Insights</h1>
          <p className="text-slate-400">
            Analyze your brand's marketing performance
          </p>
        </div>

        <Card className="bg-slate-800 border-slate-700 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="brandName"
                className="block text-sm font-medium text-white mb-2"
              >
                Brand Name
              </label>
              <input
                id="brandName"
                type="text"
                value={formData.brandName}
                onChange={(e) => handleInputChange(e, "brandName")}
                placeholder="e.g., Zoop.one"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              {formErrors.brandName && (
                <p className="text-red-400 text-sm mt-1">
                  {formErrors.brandName}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="brandWebsite"
                className="block text-sm font-medium text-white mb-2"
              >
                Brand Website
              </label>
              <input
                id="brandWebsite"
                type="text"
                value={formData.brandWebsite}
                onChange={(e) => handleInputChange(e, "brandWebsite")}
                placeholder="https://example.com"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              {formErrors.brandWebsite && (
                <p className="text-red-400 text-sm mt-1">
                  {formErrors.brandWebsite}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="contactEmail"
                className="block text-sm font-medium text-white mb-2"
              >
                Contact Email
              </label>
              <input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => handleInputChange(e, "contactEmail")}
                placeholder="contact@example.com"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              {formErrors.contactEmail && (
                <p className="text-red-400 text-sm mt-1">
                  {formErrors.contactEmail}
                </p>
              )}
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Spinner />
                  Analyzing your brand...
                </>
              ) : (
                "Get Brand Insights"
              )}
            </Button>
          </form>
        </Card>

        <p className="text-center text-slate-400 text-sm mt-6">
          We'll generate comprehensive marketing insights for your brand in
          seconds.
        </p>
      </div>
    </div>
  );
}
