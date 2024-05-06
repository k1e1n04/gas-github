import { PullRequestSummaryHistory } from "@/models/pulls/PullRequestSummaryHistory";
import { generateMockPullRequestSummary } from "@/mocks/MockPullRequestSummary";
import {PullRequestSummary} from "@/models/pulls/PullRequestSummary";

describe("PullRequestSummaryHistory", () => {
  describe("new", () => {
    it("should create a new PullRequestSummaryHistory without lastPrSummaryHistory", () => {
      const mockSummaries = [
        generateMockPullRequestSummary({
          pull_number: 1,
          updated_at: "2022-01-01",
        }),
        generateMockPullRequestSummary({
          pull_number: 2,
          updated_at: "2022-01-02",
        }),
      ];

      const result = PullRequestSummaryHistory.new(mockSummaries);

      expect(result.prCount).toEqual(mockSummaries.length);
      expect(result.lastPrUpdatedAt).toEqual(mockSummaries[1].updated_at);
      expect(result.date).toEqual(expect.any(String));
      expect(result.prCount).toEqual(expect.any(Number));
    });
  });

  it('should create a new PullRequestSummaryHistory with lastPrSummaryHistory', () => {
    const lastMockSummaries = [
        generateMockPullRequestSummary({
            pull_number: 1,
            updated_at: "2022-01-03",
        })
    ];

    const mockSummaries: PullRequestSummary[] = [];

    const lastPrSummaryHistory = PullRequestSummaryHistory.new(lastMockSummaries);

    const result = PullRequestSummaryHistory.new(mockSummaries, lastPrSummaryHistory);

    expect(result.prCount).toEqual(mockSummaries.length);
    expect(result.lastPrUpdatedAt).toEqual(lastMockSummaries[0].updated_at);
    expect(result.date).toEqual(expect.any(String));
    expect(result.prCount).toEqual(expect.any(Number));
  });

  describe("from", () => {
    it("should restore the PullRequestSummaryHistory from the record", () => {
      const mockRecord = {
        date: "2022-01-01",
        prCount: "10",
        lastPrUpdatedAt: "2022-01-01",
      };

      const result = PullRequestSummaryHistory.from(mockRecord);

      expect(result.date).toEqual(mockRecord.date);
      expect(result.prCount).toEqual(Number(mockRecord.prCount));
      expect(result.lastPrUpdatedAt).toEqual(mockRecord.lastPrUpdatedAt);
    });
  });
});
