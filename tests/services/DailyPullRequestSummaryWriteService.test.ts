import { DailyPullRequestSummaryWriteService } from "@/services/DailyPullRequestSummaryWriteService";
import { PullRequestClient } from "@/clients/GithubClient";
import { PullRequestSummaryHistoryRepository } from "@/repositories/PullRequestSummaryHistoryRepository";
import { PullRequestSummaryRepository } from "@/repositories/PullRequestSummaryRepository";
import { Repo } from "@/types/params/GetDailyPullRequestsParam";
import mockPullRequestList from "@/clients/data/PullRequestList.json";
import mockPullRequestDetail from "@/clients/data/PullRequestDetail.json";
import mockReview from "@/clients/data/ReviewList.json";
import { PullRequestResponse } from "@/types/responses/pulls/PullRequestResponse";
import { PullRequestDetailResponse } from "@/types/responses/pulls/PullRequestDetailResponse";
import { PullRequestSummaryHistory } from "@/models/pulls/PullRequestSummaryHistory";
import { PullRequestSummary } from "@/models/pulls/PullRequestSummary";

describe("DailyPullRequestSummaryWriteService", () => {
  let service: DailyPullRequestSummaryWriteService;
  let mockPrClient: jest.Mocked<PullRequestClient>;
  let mockPrSummaryHistoryRepo: jest.Mocked<PullRequestSummaryHistoryRepository>;
  let mockPrSummaryRepo: jest.Mocked<PullRequestSummaryRepository>;

  beforeEach(() => {
    mockPrClient = {
      list: jest.fn(),
      get: jest.fn(),
      listReviews: jest.fn(),
      repo: "test-repo",
    } as any;

    mockPrSummaryHistoryRepo = {
      getLatest: jest.fn(),
      store: jest.fn(),
    } as any;

    mockPrSummaryRepo = {
      store: jest.fn(),
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
        {
          name: "test-repo",
          base: "main",
        },
      ];

      const estimatedDailyPullRequests = 10;

      // Mock the methods used in writeDailyPullRequests
      mockPrClient.list.mockReturnValue(
        mockPullRequestList as PullRequestResponse[],
      );
      mockPrClient.get.mockReturnValue(
        mockPullRequestDetail as PullRequestDetailResponse,
      );
      mockPrClient.listReviews.mockReturnValue(mockReview);
      mockPrSummaryHistoryRepo.getLatest.mockReturnValue(undefined);
      mockPrSummaryRepo.store.mockReturnValue(undefined);
      mockPrSummaryHistoryRepo.store.mockReturnValue(undefined);

      const newPrSummary = PullRequestSummary.new({
        pr: mockPullRequestDetail as PullRequestDetailResponse,
        repository: "test-repo",
        reviews: mockReview,
      });

      const newPrSummaryHistory = PullRequestSummaryHistory.new(
        [newPrSummary],
        undefined,
      );

      service.writeDailyPullRequests(repos, estimatedDailyPullRequests);

      expect(mockPrClient.list).toHaveBeenCalledWith({
        base: "main",
        sort: "updated",
        direction: "desc",
        per_page: 100,
        page: 1,
        state: "closed",
      });
      expect(mockPrClient.get).toHaveBeenCalledWith(
        mockPullRequestList[0].number,
      );
      expect(mockPrClient.listReviews).toHaveBeenCalledWith(
        mockPullRequestList[0].number,
        1,
        1,
      );
      expect(mockPrSummaryRepo.store).toHaveBeenCalledWith([newPrSummary]);
      expect(mockPrSummaryHistoryRepo.store).toHaveBeenCalledWith(
        newPrSummaryHistory,
      );
    });
  });
});
