# gas-github
[![codecov](https://codecov.io/gh/k1e1n04/gas-github/branch/main/graph/badge.svg?token=ICsr4ZsHxP)](https://app.codecov.io/gh/k1e1n04/gas-github/tree/main)
![GitHub license](https://img.shields.io/github/license/k1e1n04/gas-github)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/k1e1n04/gas-github)
![GitHub last commit](https://img.shields.io/github/last-commit/k1e1n04/gas-github)

This is a Google Apps Script library for interacting with the GitHub API.

## Installation

Script ID

```
1M5ez67qXyXKHe0A-BuSalluHTKUfs_8WcNAGGp5R200pkIJ4w1h9GNdA
```

## Usage

### Setup

1. Create a new Google Spreadsheet.
2. Go to Extensions > Apps Script.
3. Copy and paste the script ID into the "Add-on script" field.
4. Click the "+" button to add the library.
5. Click the "Save" button.
6. Go to File > Project properties > Script properties.

### Use GithubApp

If you want to use GithubApp instead of a personal access token, this library also supports token generation using GithubApp.

1. Create a new GitHub App.
2. Install the GitHub App to your repository.
3. Go to the GitHub App settings and generate a private key.
4. Go to the GitHub App settings and get the App ID.
5. Go to the GitHub App settings and get the Installation ID.
6. Go to File > Project properties > Script properties.
7. Add the following properties:
   - appId: App ID
   - installationId: Installation ID
   - privateKey: Private key (Note: The newlines may be replaced with spaces. However, this is expected and should not cause any issues.)
8. Use the following code to get the installation access token

```javascript
function myFunction() {
  const props = PropertiesService.getScriptProperties()
  const appId = props.getProperty('appId')
  const installationId = props.getProperty('installationId')
  const privateKey = props.getProperty('privateKey')
  const token = new gasGitHub.gasGitHub.GitHubApp(
      privateKey,
      appId,
      installationId
  ).getInstallationAccessToken();
}
```

### L1 component

L1 component is a low-level component that provides a simple interface to the GitHub API. Here is an example of how to use the L1 component:

```javascript
function myFunction() {
  const client = new gasGitHub.gasGitHub.PullRequestClient({
    token: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", // GitHub token
    owner: "k1e1n04", // Repository owner
    repo: "gas-github", // Repository name
  });
  const prList = client.list({
    state: "open", // "open" or "closed" or "all"
    base: "main", // The branch that the pull request is merged into
    sort: "created", // "created" or "updated" or "popularity" or "long-running"
    direction: "asc", // "asc" or "desc"
    per_page: 100, // The number of pull requests to return per page(1-100)
    page: 1, // The page number to fetch
  });
  const pr = client.get(1);
  const reviews = client.listReviews(1);
}
```

### L2 component

The L2 component fetches necessary information from GitHub, processes the data, and writes the processed data into a spreadsheet. Here are the basic steps:

#### PR Summary

The estimatedDailyPullRequests parameter is used to specify the estimated number of daily pull requests.
If you're running this for the first time, you might want to set a larger number for estimatedDailyPullRequests to fetch past pull requests as well.

```javascript
function myFunction() {
  gasGitHub.gasGitHub.fetchDailyPullRequestSummary({
    githubToken: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", // GitHub token
    owner: "k1e1n04", // Repository owner
    repos: [
      {
        name: "gas-github", // Repository name
        base: "main", // Pull requests that are merged into this branch
      },
    ],
    estimatedDailyPullRequests: 100, // Estimated daily pull requests
  });
}
```

This function create 2 sheets in the active spreadsheet. The first sheet is the summary of the pull requests, and the second sheet is the history of creating the summary.

`PullRequestSummary` sheet:
You can create graphs and pivot tables from the data in this sheet.

| Header               | Description                                                 |
|----------------------|-------------------------------------------------------------|
| pull_number          | The number of the pull request.                             |
| title                | The title of the pull request.                              |
| user                 | The user who created the pull request.                      |
| status               | The status of the pull request.                             |
| milestone            | The milestone of the pull request.                          |
| comments             | The number of comments on the pull request.                 |
| review_comments      | The number of review comments on the pull request.          |
| commits              | The number of commits in the pull request.                  |
| additions            | The number of additions in the pull request.                |
| deletions            | The number of deletions in the pull request.                |
| change_files         | The number of changed files in the pull request.            |
| draft                | The draft status of the pull request.                       |
| created_at           | The date and time when the pull request was created.        |
| updated_at           | The date and time when the pull request was last updated.   |
| closed_at            | The date and time when the pull request was closed.         |
| merged_at            | The date and time when the pull request was merged.         |
| first_reviewed_at    | The date and time when the pull request was first reviewed. |
| time_to_first_review | The time taken to first review the pull request.            |
| time_to_close        | The time taken to close the pull request.                   |

`PullRequestSummaryHistory` sheet:
This sheet records the history of creating the summary.
Don't modify this sheet manually especially `lastPrUpdatedAt` column.

| Header             | Description                                               |
|--------------------|-----------------------------------------------------------|
| date               | The date when the summary was created.                    |
| pr_count           | The number of pull requests in the summary.               |
| last_pr_updated_at | The date and time when the last pull request was updated. |

`PullRequestReviewSummary` sheet:
This sheet records the summary of the pull request reviews.

| Header       | Description                                      |
|--------------|--------------------------------------------------|
| pull_number  | The number of the pull request.                  |
| repository   | The repository name.                             |
| reviewer     | The reviewer of the review.                      |
| submitted_at | The date and time when the review was submitted. |

## Contributing

Contributions are welcome! If you're interested in contributing, here are a few ways you can help:

- Report bugs: If you encounter any bugs or issues, please open an issue on GitHub.
- Suggest features: If you have an idea for a new feature or an improvement to an existing feature, please open an issue to discuss it.
- Submit pull requests: Code changes are welcome! If you've fixed a bug or implemented a new feature, please submit a pull request.
  Thank you for your interest in improving our project!
