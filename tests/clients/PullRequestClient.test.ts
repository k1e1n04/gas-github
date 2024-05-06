import { PullRequestClient } from "@/clients/GithubClient";
import { GithubClientProps } from "@/types/props/GIthubClientProps";
import { apiUtil } from "@/utils/apiUtil";
import mockPullRequestList from "./data/PullRequestList.json";
import mockPullRequestDetail from "./data/PullRequestDetail.json";
import mockListCommits from "./data/ListCommits.json";
import mockReview from "./data/ReviewList.json";

describe("PullRequestClient", () => {
  let client: PullRequestClient;
  let spy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    const props: GithubClientProps = {
      token: "test-token",
      owner: "test-owner",
      repo: "test-repo",
    };
    client = new PullRequestClient(props);
    spy = jest.spyOn(apiUtil, "customFetch");
  });

  describe("list", () => {
    it("should fetch pull requests and return the response as JSON", async () => {
      spy.mockImplementation(() => {
        return {
          status: 200,
          body: JSON.stringify(mockPullRequestList),
        };
      });

      const result = client.list({
        state: "closed",
        base: "develop",
        sort: "updated",
        direction: "desc",
        per_page: 50,
        page: 2,
      });

      expect(spy).toHaveBeenCalled();
      expect(spy.mock.calls[0][0]).toBe(
        "https://api.github.com/repos/test-owner/test-repo/pulls?state=closed&base=develop&sort=updated&direction=desc&per_page=50&page=2",
      );
      expect(result).toEqual(mockPullRequestList);
    });

    it("should fetch pull requests with default parameters", async () => {
      spy.mockImplementation(() => {
        return {
          status: 200,
          body: JSON.stringify(mockPullRequestList),
        };
      });

      const result = client.list();

      expect(spy).toHaveBeenCalled();
      expect(spy.mock.calls[0][0]).toBe(
        "https://api.github.com/repos/test-owner/test-repo/pulls?state=open&base=master&sort=created&direction=asc&per_page=30&page=1",
      );
      expect(result).toEqual(mockPullRequestList);
    });

    it("should throw an error if the fetch request fails", async () => {
      spy.mockImplementation(() => {
        return {
          status: 500,
          body: "Internal server error",
        };
      });

      expect(() => {
        client.list({
          state: "open",
          base: "master",
          sort: "created",
          direction: "asc",
          per_page: 30,
          page: 1,
        });
      }).toThrow("Failed to fetch pull requests: 500");
    });
  });

  describe("get", () => {
    it("should fetch a pull request by number and return the response as JSON", async () => {
      spy.mockImplementation(() => {
        return {
          status: 200,
          body: JSON.stringify(mockPullRequestDetail),
        };
      });

      const result = client.get(1);

      expect(spy).toHaveBeenCalled();
      expect(spy.mock.calls[0][0]).toBe(
        "https://api.github.com/repos/test-owner/test-repo/pulls/1",
      );
      expect(result).toEqual(mockPullRequestDetail);
    });

    it("should throw an error if the fetch request fails", async () => {
      spy.mockImplementation(() => {
        return {
          status: 500,
          body: "Internal server error",
        };
      });

      expect(() => {
        client.get(1);
      }).toThrow("Failed to fetch pull request: 500");
    });
  });

  describe("listCommits", () => {
    it("should fetch commits for a pull request and return the response as JSON", async () => {
      spy.mockImplementation(() => {
        return {
          status: 200,
          body: JSON.stringify(mockListCommits),
        };
      });

      const result = client.listCommits(1, 50, 2);

      expect(spy).toHaveBeenCalled();
      expect(spy.mock.calls[0][0]).toBe(
        "https://api.github.com/repos/test-owner/test-repo/pulls/1/commits?per_page=50&page=2",
      );
      expect(result).toEqual(mockListCommits);
    });

    it("should fetch commits for a pull request with default parameters", async () => {
      spy.mockImplementation(() => {
        return {
          status: 200,
          body: JSON.stringify(mockListCommits),
        };
      });

      const result = client.listCommits(1);

      expect(spy).toHaveBeenCalled();
      expect(spy.mock.calls[0][0]).toBe(
        "https://api.github.com/repos/test-owner/test-repo/pulls/1/commits?per_page=30&page=1",
      );
      expect(result).toEqual(mockListCommits);
    });

    it("should throw an error if the fetch request fails", async () => {
      spy.mockImplementation(() => {
        return {
          status: 500,
          body: "Internal server error",
        };
      });

      expect(() => {
        client.listCommits(1);
      }).toThrow("Failed to fetch commits: 500");
    });

    it("should throw an error if per_page is not between 1 and 100", async () => {
      expect(() => {
        client.listCommits(1, 200);
      }).toThrow("per_page must be between 1 and 100");
    });
  });

  describe("listReviews", () => {
    it("should fetch reviews for a pull request and return the response as JSON", async () => {
      spy.mockImplementation(() => {
        return {
          status: 200,
          body: JSON.stringify(mockReview),
        };
      });

      const result = client.listReviews(1, 50, 2);

      expect(spy).toHaveBeenCalled();
      expect(spy.mock.calls[0][0]).toBe(
        "https://api.github.com/repos/test-owner/test-repo/pulls/1/reviews?per_page=50&page=2",
      );
      expect(result).toEqual(mockReview);
    });

    it("should fetch reviews for a pull request with default parameters", async () => {
      spy.mockImplementation(() => {
        return {
          status: 200,
          body: JSON.stringify(mockReview),
        };
      });

      const result = client.listReviews(1);

      expect(spy).toHaveBeenCalled();
      expect(spy.mock.calls[0][0]).toBe(
        "https://api.github.com/repos/test-owner/test-repo/pulls/1/reviews?per_page=30&page=1",
      );
      expect(result).toEqual(mockReview);
    });

    it("should throw an error if the fetch request fails", async () => {
      spy.mockImplementation(() => {
        return {
          status: 500,
          body: "Internal server error",
        };
      });

      expect(() => {
        client.listReviews(1);
      }).toThrow("Failed to fetch reviews: 500");
    });

    it("should throw an error if per_page is not between 1 and 100", async () => {
      expect(() => {
        client.listReviews(1, 200);
      }).toThrow("per_page must be between 1 and 100");
    });
  });
});
