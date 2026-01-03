import { test } from '../utils/fixtures';
import { expect } from '@playwright/test';

test('HAR Flow - Article Creation and Retrieval', async ({ api }) => {
    const { faker } = await import('@faker-js/faker');

    // Step 1: Get articles list
    const articlesResponse = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .getRequest(200);
    expect(articlesResponse).toBeDefined();
    expect(articlesResponse).toHaveProperty('articles');

    // Step 2: Get tags
    const tagsResponse = await api
        .path('/tags')
        .getRequest(200);
    expect(tagsResponse).toBeDefined();
    expect(tagsResponse).toHaveProperty('tags');

    // Step 3: Create article with random data
    const randomTitle = faker.lorem.sentence(5);
    const randomDescription = faker.lorem.sentence(10);
    const randomBody = faker.lorem.paragraphs(2);

    const createArticleData = {
        article: {
            title: randomTitle,
            description: randomDescription,
            body: randomBody,
            tagList: []
        }
    };

    const createResponse = await api
        .path('/articles')
        .body(createArticleData)
        .postRequest(201);
    expect(createResponse).toBeDefined();
    expect(createResponse).toHaveProperty('articles');
    expect(createResponse.article).toHaveProperty('slug');

    const articleSlug = createResponse.article.slug;

    // Step 4: Get the created article
    const getArticleResponse = await api
        .path(`/articles/${articleSlug}`)
        .getRequest(200);
    expect(getArticleResponse).toBeDefined();
    expect(getArticleResponse).toHaveProperty('article');

    // Step 5: Get comments for the article
    const commentsResponse = await api
        .path(`/articles/${articleSlug}/comments`)
        .getRequest(200);
    expect(commentsResponse).toBeDefined();
    expect(commentsResponse).toHaveProperty('comments');

    // Step 6: Delete the created article
    await api
        .path(`/articles/${articleSlug}`)
        .deleteRequest(204);
});