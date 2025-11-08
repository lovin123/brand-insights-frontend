export interface KeywordVolume {
  keyword: string;
  monthlySearchVolume: number;
}

export interface Competitor {
  name: string;
  searchScore: number;
}

export interface HistoricalDataPoint {
  month: string;
  visibility: number;
  searchScore: number;
}

export interface ScoreBreakdown {
  visibility: number;
  keywordStrength: number;
  backlinks: number;
  domainAuthority: number;
}

export interface BrandInsightsMetrics {
  googleVisibility: number;
  searchScore: number;
  keywordVolumes: KeywordVolume[];
  competitorAnalysis: Competitor[];
  historicalTrend: HistoricalDataPoint[];
  scoreBreakdown: ScoreBreakdown;
}

export interface BrandInsights {
  message: string;
  submittedDetails: {
    brandName: string;
    brandWebsite: string;
    contactEmail: string;
  };
  metrics: BrandInsightsMetrics;
}

export interface BrandAnalysisRequest {
  brandName: string;
  brandWebsite: string;
  contactEmail: string;
}

class APIError extends Error {
  constructor(
    public status: number,
    public message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "APIError";
  }
}

export class BrandInsightsAPI {
  private static readonly BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  static async analyzeBrand(
    data: BrandAnalysisRequest
  ): Promise<BrandInsights> {
    try {
      const controller = new AbortController();

      const response = await fetch(`${this.BASE_URL}/api/brand-insights`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      if (!response.ok) {
        let errorMessage = "Failed to analyze brand";
        let errorDetails: unknown;

        try {
          const errorData = await response.json();
          if (Array.isArray(errorData.message)) {
            errorMessage = errorData.message[0] || errorMessage;
          } else {
            errorMessage = errorData.message || errorMessage;
          }
          errorDetails = errorData;
        } catch {
          errorMessage = `Server error: ${response.statusText}`;
        }

        throw new APIError(response.status, errorMessage, errorDetails);
      }

      const insights = await response.json();

      if (!this.validateInsights(insights)) {
        throw new APIError(
          500,
          "Invalid response format from server",
          insights
        );
      }

      return insights;
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }

      if (error instanceof TypeError && error.message === "Failed to fetch") {
        throw new APIError(
          0,
          "Unable to connect to the server. Please check your connection and try again.",
          error
        );
      }

      if (error instanceof Error && error.name === "AbortError") {
        throw new APIError(
          408,
          "Request timeout. The analysis took too long. Please try again.",
          error
        );
      }

      throw new APIError(
        500,
        error instanceof Error ? error.message : "An unexpected error occurred",
        error
      );
    }
  }

  private static validateInsights(data: unknown): data is BrandInsights {
    if (typeof data !== "object" || data === null) return false;

    const obj = data as Record<string, unknown>;

    return (
      typeof obj.message === "string" &&
      typeof obj.submittedDetails === "object" &&
      obj.submittedDetails !== null &&
      typeof (obj.submittedDetails as Record<string, unknown>).brandName ===
        "string" &&
      typeof obj.metrics === "object" &&
      obj.metrics !== null &&
      typeof (obj.metrics as Record<string, unknown>).googleVisibility ===
        "number" &&
      typeof (obj.metrics as Record<string, unknown>).searchScore ===
        "number" &&
      Array.isArray((obj.metrics as Record<string, unknown>).keywordVolumes) &&
      Array.isArray(
        (obj.metrics as Record<string, unknown>).competitorAnalysis
      ) &&
      Array.isArray((obj.metrics as Record<string, unknown>).historicalTrend) &&
      typeof (obj.metrics as Record<string, unknown>).scoreBreakdown ===
        "object"
    );
  }
}
