import { DailyPullRequestSummaryWriteService } from "@/services/DailyPullRequestSummaryWriteService";
import { PullRequestClient } from "@/clients/GithubClient";
import { PullRequestSummaryHistoryRepository } from "@/repositories/PullRequestSummaryHistoryRepository";
import { PullRequestSummaryRepository } from "@/repositories/PullRequestSummaryRepository";
import { Repo } from "@/types/params/GetDailyPullRequestsParam";

describe("DailyPullRequestSummaryWriteService", () => {
  let service: DailyPullRequestSummaryWriteService;
  let mockPrClient: jest.Mocked<PullRequestClient>;
  let mockPrSummaryHistoryRepo: jest.Mocked<PullRequestSummaryHistoryRepository>;
  let mockPrSummaryRepo: jest.Mocked<PullRequestSummaryRepository>;

  beforeEach(() => {
    mockPrClient = {
      // Mock methods of PullRequestClient
    } as any;

    mockPrSummaryHistoryRepo = {
      // Mock methods of PullRequestSummaryHistoryRepository
    } as any;

    mockPrSummaryRepo = {
      // Mock methods of PullRequestSummaryRepository
    } as any;

    service = new DailyPullRequestSummaryWriteService(
      [mockPrClient],
      mockPrSummaryHistoryRepo,
      mockPrSummaryRepo,
    );
  });

  describe("writeDailyPullRequests", () => {
    it("should write daily pull request summary", () => {
      const repos: Repo[] = [
        // Populate with test data
      ];

      const estimatedDailyPullRequests = 10;

      service.writeDailyPullRequests(repos, estimatedDailyPullRequests);

      // Add assertions to verify the behavior
    });
  });

  // Add more tests for other methods
});
