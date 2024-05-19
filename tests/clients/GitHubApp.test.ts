import { GitHubApp } from "@/clients/GitHubApp";
import { apiUtil } from "@/utils/apiUtil";
import { generateKeyPairSync } from "crypto";

describe("GitHubApp", () => {
  let spy: jest.SpyInstance;
  beforeEach(() => {
    jest.clearAllMocks();
    spy = jest.spyOn(apiUtil, "customFetch");
  });

  it("should get installation access token with private key in back quote", () => {
    const { publicKey, privateKey } = generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
    });
    const appId = "123456";
    const installationId = "123456";
    const gitHubApp = new GitHubApp(privateKey, appId, installationId);
    const expectedUrl = `https://api.github.com/app/installations/${installationId}/access_tokens`;
    spy.mockImplementation(() => {
      return {
        status: 200,
        body: JSON.stringify({ token: "test-token" }),
      };
    });
    const result = gitHubApp.getInstallationAccessToken();

    expect(spy).toHaveBeenCalledWith(expectedUrl, {
      method: "post",
      headers: expect.objectContaining({
        Authorization: expect.stringMatching(/^Bearer /),
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      }),
    });
    expect(result).toBe("test-token");
  });

  it("should get installation access token even when line breaks are replaced by spaces", () => {
    const { publicKey, privateKey } = generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
    });
    const privateKeyWithSpaces = privateKey.replace(/\n/g, " ");
    const appId = "123456";
    const installationId = "123456";
    const gitHubApp = new GitHubApp(
      privateKeyWithSpaces,
      appId,
      installationId,
    );
    const expectedUrl = `https://api.github.com/app/installations/${installationId}/access_tokens`;
    spy.mockImplementation(() => {
      return {
        status: 200,
        body: JSON.stringify({ token: "test-token" }),
      };
    });
    const result = gitHubApp.getInstallationAccessToken();

    expect(spy).toHaveBeenCalledWith(expectedUrl, {
      method: "post",
      headers: expect.objectContaining({
        Authorization: expect.stringMatching(/^Bearer /),
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      }),
    });
    expect(result).toBe("test-token");
  });
});
