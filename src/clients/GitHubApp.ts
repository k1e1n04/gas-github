import * as jwt from "jsonwebtoken";
import { apiUtil } from "@/utils/apiUtil";

/**
 * This class is responsible for handling the data access of the GitHub App
 */
export class GitHubApp {
  private readonly privateKey: string;

  constructor(
    privateKey: string,
    private appId: string,
    private installationId: string,
  ) {
    const beginMarker = "-----BEGIN RSA PRIVATE KEY-----";
    const endMarker = "-----END RSA PRIVATE KEY-----";
    const beginIndex = privateKey.indexOf(beginMarker) + beginMarker.length;
    const endIndex = privateKey.indexOf(endMarker);
    const privateKeyBody = privateKey.slice(beginIndex, endIndex);

    // Support for newlines being replaced by spaces
    if (privateKeyBody.includes(" ") && !privateKeyBody.includes("\n")) {
      this.privateKey = privateKey.replace(
        privateKeyBody,
        privateKeyBody.replace(/ /g, "\n"),
      );
    } else {
      this.privateKey = privateKey;
    }
  }

  /**
   * Get the installation access token URL for the GitHub App.
   * ref: https://docs.github.com/ja/apps/creating-github-apps/authenticating-with-a-github-app/generating-an-installation-access-token-for-a-github-app
   * @private
   */
  private get installationAccessTokenUrl(): string {
    return `https://api.github.com/app/installations/${this.installationId}/access_tokens`;
  }

  /**
   * Generate a JWT token for the GitHub App.
   * ref: https://docs.github.com/ja/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-json-web-token-jwt-for-a-github-app
   */
  private get jwt(): string {
    const payload = {
      iat: Math.floor(Date.now() / 1000) - 10,
      exp: Math.floor(Date.now() / 1000) + 60,
      iss: this.appId,
    };
    return jwt.sign(payload, this.privateKey, { algorithm: "RS256" });
  }

  /**
   * Get the headers for the GitHub App.
   * @private
   */
  private get headers() {
    return {
      Authorization: `Bearer ${this.jwt}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };
  }

  /**
   * Get the installation access token for the GitHub App.
   * ref: https://docs.github.com/ja/apps/creating-github-apps/authenticating-with-a-github-app/generating-an-installation-access-token-for-a-github-app
   * @returns - The installation access token
   */
  getInstallationAccessToken(): string {
    const res = apiUtil.customFetch(this.installationAccessTokenUrl, {
      method: "post",
      headers: this.headers,
    });
    if (res.status < 200 || res.status >= 300) {
      throw new Error(`Failed to get installation access token: ${res.status}`);
    }
    const data = JSON.parse(res.body);
    return data.token;
  }
}
