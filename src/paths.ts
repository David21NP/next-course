const paths = {
  home: () => "/",
  topicList: () => '/topics',
  topicView: (topic: string) => `/topics/${topic}`,
  postList: (topic: string) => `/topics/${topic}/posts`,
  postCreate: (topic: string) => `/topics/${topic}/posts/new`,
  postView: (topic: string, post_id: number) =>
    `/topics/${topic}/posts/${post_id}`,
};

export default paths;
