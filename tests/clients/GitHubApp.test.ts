import { GitHubApp } from "@/clients/GitHubApp";
import { apiUtil } from "@/utils/apiUtil";

describe("GitHubApp", () => {
  let gitHubApp: GitHubApp;
  let spy: jest.SpyInstance;
  beforeEach(() => {
    jest.clearAllMocks();
    spy = jest.spyOn(apiUtil, "customFetch");
  });

  it("should get installation access token with private key in back quote", () => {
    const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAl9ShM+eWWmqG6S4mH9Dny5m45PgUfTtEnh1OQJfxkXmcdGfB
47JPmC42spy0DGyZidrfbRONqv16hyph+AjeluVAyU6lEyfs8DTFi9lIMmv35csj
LCtfTE3JMGV8IaUFuWfOITMj8usdvA6ZNNGOyU2yujxzbzEhhJ3521prW8vkFtw9
xqIqmCqafsQ9FvZZfFIuo666wYvitDi8hTLyzK0MRjIjC1HwQCC7ap6PHQ04S52x
IcVUNfS6hZnSLsjkmQMOd+DHEsVsm/+ObChL/DCqW9xiidBSM5kFKWslIP3HUa+Y
eDw1sBsiqXYzrUVMp48rxunmqRhI2P86jaOqyQIDAQABAoIBAEI6WrLUYw4/h2ex
XKnmKyXxgOhHmlBiCPVbXSXp4VKOlINmOvoCbpu4FN3mYtdEi9jJI0pmDBa5CLhq
8V8LJ2T0zUTCTFlFwiGpMz5kYgy0cebHrCj5JlGXYJn+up3GaO/N6ukqcJTmoArG
52dVvY3rmXmJIuUuris16aYYE9pvMH65kQbevB/s65TH60vOYFnWskrLwvSwwGWl
CIKrSTLzW6t4zoMTmL+mOuIgLce8lMSJFpggFifMEuCrhQJ4MOlSDHHByBtBdGnp
e2OzzN7o+Q9KIgAwqbkEJ44ffAEeM4kL8uhsj/uVBh85mjS1VsSyoYl2uM9S+HRp
zGLfde0CgYEA5wRvx+B9mJpz1clSywIlW8luR+SLOaFjQaHQGnTmV87hw3SYUMDf
QCEHyemYXFy8JoUqhjkw42MiuXQVbn8WyvVOglafcfT8uqCdngc6VCF3Rog14ivs
gDZDRB/2mLlpsoV0z3paExe/4RDX/s3rH3veuNKpuz67CdicqwRInTsCgYEAqD/1
vFzoZFT7LlP/fbUf+Ugwh3WygIDwdj62/Sz7+9IrMC9LRGzDVt9ffK5of9sGzNQk
vxiOJtZdUBvNktE0NvHrbSx96kN2Sw63tV6R2cbYX/uPx5oSQyY77mtDQiJoQgu3
kzsWXeBx838QA2bPvCgfHUL/6gZYsunDGUKhJ8sCgYEAo7mqOx8oBDJarAZdzhC8
R1vv87XO0k5F2SsEIOv+n/a4XFzS4lB/KKUALyKF39e9ZRN1uuDnfBAzePoDgmdB
0R+fv5ICuLHnN6FDc88tkJiTPwKkJaH5oDhU3gBFNaIaffJFghH1qphnXewhGK35
2Dti8twifNkNmAHTrwR/LicCgYAhkxHgktG1I9gz+IMlfL1yq1szzOLgDdruXbl6
cD2glOIVbXqhnuqkLVMKuGsWCIkk2riygZ3sVh6s2798Ks82n7QRRy2hT/ENLVSv
lr2YLbwD+1lHxZEbYUfYXgM/8UnI1Dm/4aym8yEKLDLv2tZdf8wltLcI5ldQ7KEI
K2mpXQKBgEoWNOe/hrrFFP1YmsNa4f0WjhZEweyDFSU7WKELWKV+ZXMgrhsA6r6L
65iddV4LWyUcu861bSvj6E9D17ocHjYP2VQm+Rqnote/WwqHF3AJx922FiKdh6mD
r2kL0pBu58zLyN+U1Uxc49/GkX5K+iep56T533vkUEkH3tq5NwyX
-----END RSA PRIVATE KEY-----`;
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
      const privateKey = "-----BEGIN RSA PRIVATE KEY----- MIIEowIBAAKCAQEAl9ShM+eWWmqG6S4mH9Dny5m45PgUfTtEnh1OQJfxkXmcdGfB 47JPmC42spy0DGyZidrfbRONqv16hyph+AjeluVAyU6lEyfs8DTFi9lIMmv35csj LCtfTE3JMGV8IaUFuWfOITMj8usdvA6ZNNGOyU2yujxzbzEhhJ3521prW8vkFtw9 xqIqmCqafsQ9FvZZfFIuo666wYvitDi8hTLyzK0MRjIjC1HwQCC7ap6PHQ04S52x IcVUNfS6hZnSLsjkmQMOd+DHEsVsm/+ObChL/DCqW9xiidBSM5kFKWslIP3HUa+Y eDw1sBsiqXYzrUVMp48rxunmqRhI2P86jaOqyQIDAQABAoIBAEI6WrLUYw4/h2ex XKnmKyXxgOhHmlBiCPVbXSXp4VKOlINmOvoCbpu4FN3mYtdEi9jJI0pmDBa5CLhq 8V8LJ2T0zUTCTFlFwiGpMz5kYgy0cebHrCj5JlGXYJn+up3GaO/N6ukqcJTmoArG 52dVvY3rmXmJIuUuris16aYYE9pvMH65kQbevB/s65TH60vOYFnWskrLwvSwwGWl CIKrSTLzW6t4zoMTmL+mOuIgLce8lMSJFpggFifMEuCrhQJ4MOlSDHHByBtBdGnp e2OzzN7o+Q9KIgAwqbkEJ44ffAEeM4kL8uhsj/uVBh85mjS1VsSyoYl2uM9S+HRp zGLfde0CgYEA5wRvx+B9mJpz1clSywIlW8luR+SLOaFjQaHQGnTmV87hw3SYUMDf QCEHyemYXFy8JoUqhjkw42MiuXQVbn8WyvVOglafcfT8uqCdngc6VCF3Rog14ivs gDZDRB/2mLlpsoV0z3paExe/4RDX/s3rH3veuNKpuz67CdicqwRInTsCgYEAqD/1 vFzoZFT7LlP/fbUf+Ugwh3WygIDwdj62/Sz7+9IrMC9LRGzDVt9ffK5of9sGzNQk vxiOJtZdUBvNktE0NvHrbSx96kN2Sw63tV6R2cbYX/uPx5oSQyY77mtDQiJoQgu3 kzsWXeBx838QA2bPvCgfHUL/6gZYsunDGUKhJ8sCgYEAo7mqOx8oBDJarAZdzhC8 R1vv87XO0k5F2SsEIOv+n/a4XFzS4lB/KKUALyKF39e9ZRN1uuDnfBAzePoDgmdB 0R+fv5ICuLHnN6FDc88tkJiTPwKkJaH5oDhU3gBFNaIaffJFghH1qphnXewhGK35 2Dti8twifNkNmAHTrwR/LicCgYAhkxHgktG1I9gz+IMlfL1yq1szzOLgDdruXbl6 cD2glOIVbXqhnuqkLVMKuGsWCIkk2riygZ3sVh6s2798Ks82n7QRRy2hT/ENLVSv lr2YLbwD+1lHxZEbYUfYXgM/8UnI1Dm/4aym8yEKLDLv2tZdf8wltLcI5ldQ7KEI K2mpXQKBgEoWNOe/hrrFFP1YmsNa4f0WjhZEweyDFSU7WKELWKV+ZXMgrhsA6r6L 65iddV4LWyUcu861bSvj6E9D17ocHjYP2VQm+Rqnote/WwqHF3AJx922FiKdh6mD r2kL0pBu58zLyN+U1Uxc49/GkX5K+iep56T533vkUEkH3tq5NwyX -----END RSA PRIVATE KEY-----"
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
});
