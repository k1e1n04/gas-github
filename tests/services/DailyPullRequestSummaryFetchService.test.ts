import { DailyPullRequestSummaryFetchService } from "@/services/DailyPullRequestSummaryFetchService";
import { PullRequestClient } from "@/clients/GitHubClient";
import { PullRequestSummaryHistoryRepository } from "@/repositories/PullRequestSummaryHistoryRepository";
import mockPullRequestList from "@/clients/data/PullRequestList.json";
import mockPullRequestDetail from "@/clients/data/PullRequestDetail.json";
import mockReview from "@/clients/data/ReviewList.json";
import { PullRequestResponse } from "@/types/responses/pulls/PullRequestResponse";
import { PullRequestDetailResponse } from "@/types/responses/pulls/PullRequestDetailResponse";

describe("DailyPullRequestSummaryFetchService", () => {
  let service: DailyPullRequestSummaryFetchService;
  let mockPrClient: jest.Mocked<PullRequestClient>;
  let mockPrSummaryHistoryRepo: jest.Mocked<PullRequestSummaryHistoryRepository>;

  beforeEach(() => {
    mockPrClient = {
      list: jest.fn(),
      get: jest.fn(),
      listReviews: jest.fn(),
      repo: "test-repo",
    } as any;

    mockPrSummaryHistoryRepo = {
      getLatest: jest.fn(),
    } as any;
  });

  describe("fetchDailyPullRequests", () => {
    it("should fetch daily pull requests with 10 estimatedDailyPullRequests", async () => {
      mockPrClient.list.mockReturnValue(
        mockPullRequestList as PullRequestResponse[],
      );
      mockPrClient.get.mockReturnValue(
        mockPullRequestDetail as PullRequestDetailResponse,
      );
      mockPrClient.listReviews.mockReturnValue(mockReview);
      mockPrSummaryHistoryRepo.getLatest.mockReturnValue(undefined);

      service = new DailyPullRequestSummaryFetchService(
        [mockPrClient],
        mockPrSummaryHistoryRepo,
      );

      service.fetchDailyPullRequests(
        [
          {
            name: "test-repo",
            base: "main",
          },
        ],
        10,
      );

      expect(mockPrSummaryHistoryRepo.getLatest).toHaveBeenCalled();
      expect(mockPrClient.list).toHaveBeenCalledWith({
        state: "closed",
        base: "main",
        sort: "updated",
        direction: "desc",
        per_page: 100,
        page: 1,
      });
      expect(mockPrClient.get).toHaveBeenCalledWith(
        mockPullRequestList[0].number,
      );
      expect(mockPrClient.listReviews).toHaveBeenCalledWith(
        mockPullRequestList[0].number,
        1,
        1,
      );
      expect(mockPrClient.listReviews).toHaveBeenCalledWith(
        mockPullRequestList[0].number,
        100,
        1,
      );
    });
  });

  describe("fetchDailyPullRequests", () => {
    it("should fetch daily pull requests with 150 estimatedDailyPullRequests", async () => {
      mockPrClient.list.mockReturnValue(
        mockPullRequestList as PullRequestResponse[],
      );
      const mockPullRequestList2 = mockPullRequestList.map((pr) => {
        return {
          ...pr,
          number: pr.number + 1,
        };
      });
      mockPrClient.list.mockReturnValueOnce(
        mockPullRequestList2 as PullRequestResponse[],
      );
      mockPrClient.get.mockReturnValue(
        mockPullRequestDetail as PullRequestDetailResponse,
      );
      const mockPullRequestDetail2 = {
        ...mockPullRequestDetail,
        number: mockPullRequestDetail.number + 1,
      };
      mockPrClient.get.mockReturnValueOnce(
        mockPullRequestDetail2 as PullRequestDetailResponse,
      );
      mockPrClient.listReviews.mockReturnValue(mockReview);
      const mockReview2 = mockReview.map((review) => {
        return {
          ...review,
          id: review.id + 1,
        };
      });
      mockPrClient.listReviews.mockReturnValueOnce(mockReview2);

      mockPrSummaryHistoryRepo.getLatest.mockReturnValue(undefined);

      service = new DailyPullRequestSummaryFetchService(
        [mockPrClient],
        mockPrSummaryHistoryRepo,
      );

      service.fetchDailyPullRequests(
        [
          {
            name: "test-repo",
            base: "main",
          },
        ],
        150,
      );

      expect(mockPrSummaryHistoryRepo.getLatest).toHaveBeenCalled();
      expect(mockPrClient.list).toHaveBeenCalledWith({
        state: "closed",
        base: "main",
        sort: "updated",
        direction: "desc",
        per_page: 100,
        page: 1,
      });
      expect(mockPrClient.list).toHaveBeenCalledWith({
        state: "closed",
        base: "main",
        sort: "updated",
        direction: "desc",
        per_page: 100,
        page: 2,
      });
      expect(mockPrClient.get).toHaveBeenCalledWith(
        mockPullRequestList[0].number,
      );
      expect(mockPrClient.get).toHaveBeenCalledWith(
        mockPullRequestList2[0].number,
      );
      expect(mockPrClient.listReviews).toHaveBeenCalledWith(
        mockPullRequestList2[0].number,
        1,
        1,
      );
      expect(mockPrClient.listReviews).toHaveBeenCalledWith(
        mockPullRequestList[0].number,
        1,
        1,
      );
      expect(mockPrClient.listReviews).toHaveBeenCalledWith(
        mockPullRequestList[0].number,
        100,
        1,
      );
      expect(mockPrClient.listReviews).toHaveBeenCalledWith(
        mockPullRequestList2[0].number,
        100,
        1,
      );
    });
  });
});
