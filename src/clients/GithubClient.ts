
class GithubClient {
  #token: string;
  #owner: string;
  #repo: string;
  #baseUrl: string = 'https://api.github.com/repos';
  #resource: string;
  constructor(token: string, owner: string, repo: string) {
    this.#token = token;
    this.#owner = owner;
    this.#repo = repo;
  }
}

class PullRequestClient extends GithubClient {
  #resource: string = 'pulls';
  constructor(token: string, owner: string, repo: string) {
    super(token, owner, repo);
  }
}

class IssueClient extends GithubClient {
  #resource: string = 'issues';
  constructor(token: string, owner: string, repo: string) {
    super(token, owner, repo);
  }
}

class CommitClient extends GithubClient {
  #resource: string = 'commits';
  constructor(token: string, owner: string, repo: string) {
    super(token, owner, repo);
  }
}
