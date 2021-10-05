import PostRepository from './postsRepository';
const repositories = {
    posts: PostRepository
}
export const RepositoryFactory = {
    communicationAPI: name => repositories[name],
}