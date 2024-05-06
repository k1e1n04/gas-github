import { fetchDailyPullRequestSummary } from "@/managers/fetchDailyPullRequestSummary";
import { DailyPullRequestSummaryWriteService } from "@/services/DailyPullRequestSummaryWriteService";
import { GetDailyPullRequestsParam } from "@/types/params/GetDailyPullRequestsParam";

jest.mock("@/services/DailyPullRequestSummaryWriteService");

describe("fetchDailyPullRequestSummary", () => {
  it("should call writeDailyPullRequests with correct parameters", () => {
    const mockWriteDailyPullRequests = jest.fn();
    (DailyPullRequestSummaryWriteService as jest.Mock).mockImplementation(
      () => {
        return {
          writeDailyPullRequests: mockWriteDailyPullRequests,
        };
      },
    );

    const mockParam: GetDailyPullRequestsParam = {
      githubToken: "test-token",
      owner: "test-owner",
      repos: [
        {
          name: "test-repo",
          base: "master",
        },
      ],
      estimatedDailyPullRequests: 10,
    };

    fetchDailyPullRequestSummary(mockParam);

    expect(mockWriteDailyPullRequests).toHaveBeenCalledWith(
      mockParam.repos,
      mockParam.estimatedDailyPullRequests,
    );
  });
});
