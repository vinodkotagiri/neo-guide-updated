import { createSlice } from "@reduxjs/toolkit";
interface articleState {
  articleData: Array<{ text?: string; image_url?: string }>;
  findText: string;
  replaceText: string;
  htmlContent: string;
}
const initialState: articleState = {
  articleData: [
    {
      text: "In this tutorial, we'll dive into enhancing software architecture with caching techniques to improve system performance. By the end, you'll understand how to strategically implement caching to handle millions of requests efficiently and recognize its potential challenges."
    },
    {
      image_url: null
    },
    {
      text: "Step 1: Understand the Benefits of Caching  \nCaching stores data temporarily, allowing future requests for the same data to be served faster. It significantly reduces latency, enhancing the user experience."
    },
    {
      image_url: "https://effybiz-devops.s3.ap-south-1.amazonaws.com/deeac18b-79dc-49a3-baef-e302fdeae96a_frame_10.jpg"
    },
    {
      text: "Step 2: Explore Different Types of Cache  \nConsider using a content delivery network (CDN) to cache static assets like images, ensuring users don’t download them repeatedly. Implement a memory or local cache on your services to quickly respond to requests. For broader needs, utilize distributed cache options such as Redis or Memcache, especially as a layer before hitting the database."
    },
    {
      image_url: null
    },
    {
      text: "Step 3: Identify Suitable Layers for Cache  \nAlmost any part of the architecture can support caching. Prioritize layers that experience high CPU and memory usage for caching, ensuring balanced performance."
    },
    {
      image_url: "https://effybiz-devops.s3.amazonaws.com/generated-gifs/output.gif"
    },
    {
      text: "Step 4: Address Cache Complications  \nBe aware that integrating cache adds complexity. For instance, Phil Carton highlights cache invalidation as a particularly challenging problem in computer science."
    },
    // {
    //   image_url: "https://effybiz-devops.s3.ap-south-1.amazonaws.com/860b6b33-93c5-49e5-a53f-263b1456c8af_frame_45.jpg"
    // },
    // {
    //   text: "Step 5: Manage Update Latency  \nConsider update latency when caching search results. For example, if users search for a product like computers, cached results avoid frequent hits to the database. However, ensure cache invalidation is timely to prevent showing outdated product information."
    // },
    // {
    //   image_url: "https://effybiz-devops.s3.ap-south-1.amazonaws.com/3cade31e-6bf4-4475-b2e1-3295fae73659_frame_60.jpg"
    // },
    // {
    //   text: "Step 6: Handle Cache Misses  \nIf a server under a load balancer caches a specific result such as a user cart, redirecting users to another server might lead to cache misses. Servers without the cached data must recalculate and cache again. Maintain consistency in server direction to minimize cache misses."
    // },
    // {
    //   image_url: "https://effybiz-devops.s3.ap-south-1.amazonaws.com/e4fb8184-8c9b-4cdf-9ae2-c2f79271b7ef_frame_70.jpg"
    // },
    // {
    //   text: "Step 7: Design Your Cache Strategy  \nThoughtfully design your cache layers to prevent headaches. Implementing multiple cache layers can be advantageous but requires meticulous planning for optimal results."
    // },
    // {
    //   image_url: null
    // },
    // {
    //   text: "Through caching, scalability, and improvements, your system can efficiently handle increased traffic while maintaining fast user responses. Remember, cache can be added progressively as it's an optimization tactic. Evaluate your needs and evolve your architecture accordingly."
    // },
    // {
    //   image_url: "https://effybiz-devops.s3.ap-south-1.amazonaws.com/c25aa59c-5d52-4fea-a221-4298ab980216_frame_95.jpg"
    // },
    // {
    //   text: "By following these steps, your understanding of caching will evolve, contributing to the performance and efficiency of your system's architecture."
    // },
    // {
    //   image_url: null
    // }
  ],
  findText: "",
  replaceText: "",
  htmlContent: ""
};
const articleSlice = createSlice({
  name: "article",
  initialState,
  reducers: {
    setArticleData: (state, action) => {
      state.articleData = action.payload;
      window.localStorage.setItem("articleData", JSON.stringify(action.payload));
    },
    setFindText: (state, action) => {
      state.findText = action.payload;
    },
    setReplaceText: (state, action) => {
      state.replaceText = action.payload;
    },

    handleReplaceText: (state) => {
      if (state.findText != "" && state.replaceText != "") {
        state.articleData = state.articleData.map((article) => {
          if (article.text) {
            article.text = article.text.replace(new RegExp(state.findText, "gi"), state.replaceText);
          }
          return article;
        });
      }
    },

    setHtmlContent: (state, action) => {
      state.htmlContent = action.payload;
    }
  }
});
export const { setArticleData, setFindText, setReplaceText, handleReplaceText, setHtmlContent } = articleSlice.actions;
export default articleSlice.reducer;
