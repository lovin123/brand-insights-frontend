"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, TrendingUp } from "lucide-react";
import { useInsights } from "@/app/providers";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function InsightsPage() {
  const router = useRouter();
  const { insights, error: contextError } = useInsights();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading your insights...</p>
        </div>
      </div>
    );
  }

  if (contextError || !insights) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center p-4">
        <Card className="bg-slate-800 border-slate-700 p-8 max-w-md w-full">
          <h2 className="text-xl font-semibold text-white mb-4">Error</h2>
          <p className="text-slate-400 mb-6">
            {contextError ||
              "No insights data found. Please analyze a brand first."}
          </p>
          <Button
            onClick={() => router.push("/")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Back to Form
          </Button>
        </Card>
      </div>
    );
  }

  const metrics = insights.metrics;
  const details = insights.submittedDetails;

  const visibilityData = metrics.historicalTrend.map((item) => ({
    month: item.month,
    visibility: item.visibility,
    searchScore: item.searchScore,
  }));

  const scoreBreakdownData = [
    { name: "Visibility", value: metrics.scoreBreakdown.visibility },
    { name: "Keyword Strength", value: metrics.scoreBreakdown.keywordStrength },
    { name: "Backlinks", value: metrics.scoreBreakdown.backlinks },
    { name: "Domain Authority", value: metrics.scoreBreakdown.domainAuthority },
  ];

  const competitorData = metrics.competitorAnalysis.map((comp) => ({
    name: comp.name,
    score: comp.searchScore,
  }));

  const keywordData = metrics.keywordVolumes.map((kw) => ({
    keyword: kw.keyword,
    volume: kw.monthlySearchVolume,
  }));

  const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b"];

  const downloadReport = () => {
    const report = `
Brand Insights Report
=====================

Brand Details
${"-".repeat(50)}
Name: ${details.brandName}
Website: ${details.brandWebsite}
Contact Email: ${details.contactEmail}

Key Metrics
${"-".repeat(50)}
Google Visibility Score: ${metrics.googleVisibility}/100
Search Score: ${metrics.searchScore}/100

Score Breakdown
${"-".repeat(50)}
Visibility: ${metrics.scoreBreakdown.visibility}/100
Keyword Strength: ${metrics.scoreBreakdown.keywordStrength}/100
Backlinks: ${metrics.scoreBreakdown.backlinks}/100
Domain Authority: ${metrics.scoreBreakdown.domainAuthority}/100

Top Keywords
${"-".repeat(50)}
${metrics.keywordVolumes
  .map(
    (kw) =>
      `${
        kw.keyword
      }: ${kw.monthlySearchVolume.toLocaleString()} monthly searches`
  )
  .join("\n")}

Competitor Analysis
${"-".repeat(50)}
${metrics.competitorAnalysis
  .map((comp) => `${comp.name}: ${comp.searchScore}/100`)
  .join("\n")}
    `.trim();

    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${details.brandName}-insights-report.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="border-slate-600 text-slate-300 bg-slate-700 hover:bg-slate-700 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-4xl font-bold text-white text-center flex-1">
            Brand Insights Dashboard
          </h1>
          <Button
            onClick={downloadReport}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>

        {/* Brand Info Card */}
        <Card className="bg-gradient-to-br from-slate-800 to-slate-700 border-slate-700 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-slate-400 text-sm uppercase tracking-wide mb-1">
                Brand Name
              </p>
              <p className="text-2xl font-bold text-white">
                {details.brandName}
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-sm uppercase tracking-wide mb-1">
                Website
              </p>
              <p className="text-white break-all">{details.brandWebsite}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm uppercase tracking-wide mb-1">
                Contact
              </p>
              <p className="text-white">{details.contactEmail}</p>
            </div>
          </div>
        </Card>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700 p-8 flex flex-col items-center justify-center">
            <p className="text-slate-400 text-sm uppercase tracking-wide mb-2">
              Google Visibility Score
            </p>
            <div className="relative w-40 h-40 mb-4">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#334155"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="8"
                  strokeDasharray={`${
                    (metrics.googleVisibility / 100) * 283
                  } 283`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold text-blue-400">
                  {metrics.googleVisibility}
                </span>
              </div>
            </div>
            <p className="text-slate-400 text-sm">Out of 100</p>
          </Card>

          <Card className="bg-slate-800 border-slate-700 p-8 flex flex-col items-center justify-center">
            <p className="text-slate-400 text-sm uppercase tracking-wide mb-2">
              Search Score
            </p>
            <div className="relative w-40 h-40 mb-4">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#334155"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="8"
                  strokeDasharray={`${(metrics.searchScore / 100) * 283} 283`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold text-purple-400">
                  {metrics.searchScore}
                </span>
              </div>
            </div>
            <p className="text-slate-400 text-sm">Out of 100</p>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Historical Trend */}
          <Card className="bg-slate-800 border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              6-Month Performance Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={visibilityData}
                margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                  }}
                  labelStyle={{ color: "#e2e8f0" }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="visibility"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="searchScore"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ fill: "#8b5cf6", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Score Breakdown Pie Chart */}
          <Card className="bg-slate-800 border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Score Components Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={scoreBreakdownData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {scoreBreakdownData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                  }}
                  labelStyle={{ color: "#e2e8f0" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Competitor Analysis */}
        <Card className="bg-slate-800 border-slate-700 p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">
            Competitor Analysis
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={competitorData}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                }}
                labelStyle={{ color: "#e2e8f0" }}
              />
              <Bar dataKey="score" fill="#f59e0b" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Keywords Table */}
        <Card className="bg-slate-800 border-slate-700 p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">
            Top Keywords
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400 text-sm font-semibold">
                    Keyword
                  </th>
                  <th className="text-right py-3 px-4 text-slate-400 text-sm font-semibold">
                    Monthly Search Volume
                  </th>
                </tr>
              </thead>
              <tbody>
                {keywordData.map((kw, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-slate-700/50 hover:bg-slate-700/50 transition"
                  >
                    <td className="py-3 px-4 text-white">{kw.keyword}</td>
                    <td className="py-3 px-4 text-right text-blue-400 font-semibold">
                      {kw.volume.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Score Breakdown Detailed Table */}
        <Card className="bg-slate-800 border-slate-700 p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">
            Detailed Score Breakdown
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {scoreBreakdownData.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-700/50 rounded-lg p-4 text-center"
              >
                <p className="text-slate-400 text-sm mb-2">{item.name}</p>
                <p className="text-3xl font-bold text-white">{item.value}</p>
                <div className="mt-3 w-full bg-slate-600 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${item.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <Button
            onClick={() => router.push("/")}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2"
          >
            Analyze Another Brand
          </Button>
          <Button
            onClick={downloadReport}
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Full Report
          </Button>
        </div>
      </div>
    </div>
  );
}
