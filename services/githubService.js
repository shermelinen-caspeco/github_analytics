const { Octokit } = require('@octokit/rest');

class GitHubService {
  constructor() {
    // Only add auth if token is provided
    const config = {
      userAgent: 'github-analytics-app/1.0.0'
    };
    
    if (process.env.GITHUB_TOKEN && process.env.GITHUB_TOKEN !== 'your_github_token_here') {
      config.auth = process.env.GITHUB_TOKEN;
    }
    
    this.octokit = new Octokit(config);
  }

  async getOrganizationRepositories(org) {
    try {
      console.log(`Fetching repositories for organization: ${org}`);
      
      let allRepos = [];
      let page = 1;
      let hasMorePages = true;

      while (hasMorePages) {
        const response = await this.octokit.rest.repos.listForOrg({
          org: org,
          type: 'all', // 'all', 'public', 'private', 'forks', 'sources', 'member'
          sort: 'updated',
          direction: 'desc',
          per_page: 100,
          page: page
        });

        allRepos = allRepos.concat(response.data);
        
        // Check if there are more pages
        hasMorePages = response.data.length === 100;
        page++;

        console.log(`Fetched ${response.data.length} repositories from page ${page - 1}`);
      }

      console.log(`Total repositories fetched: ${allRepos.length}`);
      
      return allRepos.map(repo => ({
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description,
        private: repo.private,
        htmlUrl: repo.html_url,
        cloneUrl: repo.clone_url,
        sshUrl: repo.ssh_url,
        language: repo.language,
        stargazersCount: repo.stargazers_count,
        watchersCount: repo.watchers_count,
        forksCount: repo.forks_count,
        openIssuesCount: repo.open_issues_count,
        size: repo.size,
        defaultBranch: repo.default_branch,
        archived: repo.archived,
        disabled: repo.disabled,
        fork: repo.fork,
        createdAt: repo.created_at,
        updatedAt: repo.updated_at,
        pushedAt: repo.pushed_at,
        topics: repo.topics || [],
        visibility: repo.visibility,
        hasIssues: repo.has_issues,
        hasProjects: repo.has_projects,
        hasWiki: repo.has_wiki,
        hasPages: repo.has_pages,
        hasDiscussions: repo.has_discussions
      }));
    } catch (error) {
      console.error('Error fetching repositories:', error.message);
      throw error;
    }
  }

  async getRepositoryDetails(owner, repo) {
    try {
      const response = await this.octokit.rest.repos.get({
        owner,
        repo
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching repository details for ${owner}/${repo}:`, error.message);
      throw error;
    }
  }

  async getRepositoryLanguages(owner, repo) {
    try {
      const response = await this.octokit.rest.repos.listLanguages({
        owner,
        repo
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching languages for ${owner}/${repo}:`, error.message);
      throw error;
    }
  }

  async getRepositoryContributors(owner, repo) {
    try {
      const response = await this.octokit.rest.repos.listContributors({
        owner,
        repo,
        per_page: 100
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching contributors for ${owner}/${repo}:`, error.message);
      throw error;
    }
  }

  async getOrganizationMembers(org) {
    try {
      console.log(`Fetching members for organization: ${org}`);
      
      let allMembers = [];
      let page = 1;
      let hasMorePages = true;

      while (hasMorePages) {
        const response = await this.octokit.rest.orgs.listMembers({
          org: org,
          per_page: 100,
          page: page
        });

        allMembers = allMembers.concat(response.data);
        
        hasMorePages = response.data.length === 100;
        page++;

        console.log(`Fetched ${response.data.length} members from page ${page - 1}`);
      }

      console.log(`Total members fetched: ${allMembers.length}`);
      
      return allMembers.map(member => ({
        id: member.id,
        login: member.login,
        nodeId: member.node_id,
        avatarUrl: member.avatar_url,
        gravatarId: member.gravatar_id,
        url: member.url,
        htmlUrl: member.html_url,
        followersUrl: member.followers_url,
        followingUrl: member.following_url,
        gistsUrl: member.gists_url,
        starredUrl: member.starred_url,
        subscriptionsUrl: member.subscriptions_url,
        organizationsUrl: member.organizations_url,
        reposUrl: member.repos_url,
        eventsUrl: member.events_url,
        receivedEventsUrl: member.received_events_url,
        type: member.type,
        siteAdmin: member.site_admin
      }));
    } catch (error) {
      console.error('Error fetching organization members:', error.message);
      throw error;
    }
  }

  async getRateLimits() {
    try {
      const response = await this.octokit.rest.rateLimit.get();
      return response.data;
    } catch (error) {
      console.error('Error fetching rate limits:', error.message);
      throw error;
    }
  }
}

module.exports = new GitHubService();