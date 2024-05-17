import { PullRequestClient } from "@/clients/GithubClient";
import { PullRequestReviewSummary } from "@/models/pulls/PullRequestReviewSummary";

/**
 * This class is responsible for fetching the pull request review summary.
 */
export class PullRequestReviewFetchService {
  constructor(private client: PullRequestClient) {}

  /**
   * Fetch pull request review summaries
   * @param prNumber - pull request number
   * @returns - pull request review summaries
   */
  fetch(prNumber: number): PullRequestReviewSummary[] {
    const reviews = this.client.listReviews(prNumber, 100, 1);
    return reviews.map((review) => {
      return PullRequestReviewSummary.new({
        pullNumber: prNumber,
        repository: this.client.repo,
        review: review,
      });
    });
  }
}
