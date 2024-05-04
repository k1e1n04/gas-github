import {PullRequestClient} from "@/clients/GithubClient";
import {GithubClientProps} from "@/types/props/GIthubClientProps";
import {utils} from "@/utils/utils";

describe('PullRequestClient', () => {
    let client: PullRequestClient;
    let spy: jest.SpyInstance;

    beforeEach(() => {
        jest.clearAllMocks();
        const props: GithubClientProps = {
            token: 'test-token',
            owner: 'test-owner',
            repo: 'test-repo',
        };
        client = new PullRequestClient(props);
        spy = jest.spyOn(utils, 'customFetch');
    });

    describe('list', () => {
        it('should fetch pull requests and return the response as JSON', async () => {
            const mockResponse = require('./data/PullRequestList.json');

            spy.mockImplementation((url, options) => {
                return {
                    status: 200,
                    body: JSON.stringify(mockResponse),
                };
            });

            const result = client.list({
                state: 'closed',
                base: 'develop',
                sort: 'updated',
                direction: 'desc',
                per_page: 50,
                page: 2,
            });

            expect(spy).toHaveBeenCalled();
            expect(spy.mock.calls[0][0]).toBe('https://api.github.com/repos/test-owner/test-repo/pulls?state=closed&base=develop&sort=updated&direction=desc&per_page=50&page=2');
            expect(result).toEqual(mockResponse);
        });

        it('should fetch pull requests with default parameters', async () => {
            const mockResponse = require('./data/PullRequestList.json');

            spy.mockImplementation((url, options) => {
                return {
                    status: 200,
                    body: JSON.stringify(mockResponse),
                };
            });

            const result = client.list();

            expect(spy).toHaveBeenCalled();
            expect(spy.mock.calls[0][0]).toBe('https://api.github.com/repos/test-owner/test-repo/pulls?state=open&base=master&sort=created&direction=asc&per_page=30&page=1');
            expect(result).toEqual(mockResponse);
        });

        it('should throw an error if the fetch request fails', async () => {
            spy.mockImplementation((url, options) => {
                return {
                    status: 500,
                    body: 'Internal server error',
                };
            });

            expect(() => {
                client.list({
                    state: 'open',
                    base: 'master',
                    sort: 'created',
                    direction: 'asc',
                    per_page: 30,
                    page: 1,
                });
            }).toThrow('Failed to fetch pull requests: 500');
        });
    });

    // Add similar describe and it blocks for the other methods
});
