import { createSlice } from "@reduxjs/toolkit";
// const DOCX_URL = "https://converter-effy.s3.amazonaws.com/session_5_20241228_122014/session_5_20241228_122014_Transcription_With_Clicks.docx";
// const DOCX_URL = "https://www.lehman.edu/faculty/john/classroomrespolicy1.docx";
interface articleState{
  articleData:Array<{text:string,image_url:string}>
}
const initialState:articleState={
  articleData: [
    {
      image_url: "",
      text: "Step 1: We will guide you through the process of executing email marketing on SendGrid."
    },
    {
      image_url: "",
      text: "Step 2: In this article, we'll examine the process of email marketing on Sangrid and its potential benefits for businesses. First, we need to understand what Sangrid is."
    },
    {
      image_url: "",
      text: "Step 3: We need to visit Sangrid.com and sign up for free. This procedure is very simple and straightforward."
    },
    {
      image_url: "https://converter-effy.s3.ap-southeast-1.amazonaws.com/8cb4314e-10aa-4aad-bb5d-0d04579aaf0d.jpg",
      text: ""
    },
    {
      image_url: "",
      text: "Step 4: Log in using your Google account or email address. After this step, you will be directed to the next page."
    },
    {
      image_url: "",
      text: "Step 5: We will now start sending our emails using the operational Sangrid dashboard."
    },
    {
      image_url: "",
      text: "Step 6: We will use Sendgrid for our marketing efforts. The process requires us to undertake the following responsibilities:"
    },
    {
      image_url: "https://converter-effy.s3.ap-southeast-1.amazonaws.com/452279de-81be-4596-bfdd-12fd6a397036.jpg",
      text: ""
    },
    {
      image_url: "",
      text: "Step 7: We need to create a sender ID and a sender account on Sangrid. To accomplish this, let's click on 'create'."
    },
    {
      image_url: "",
      text: "Step 8: We require a single sender for dispatching emails as we currently do not have team support available."
    },
    {
      image_url: "",
      text: "Step 9: We are going to send an email. Therefore, we will set up a unique sender account to dispatch it solely from us."
    },
    {
      image_url: "https://converter-effy.s3.ap-southeast-1.amazonaws.com/71f0f738-d9f5-46d2-9c4d-d64dcd1c98ad.jpg",
      text: ""
    },
    {
      image_url: "",
      text: "Step 10: We need to first establish a sender account, then proceed to log in."
    },
    {
      image_url: "",
      text: "Step 11: With the available information, we will populate the required fields."
    },
    {
      image_url: "",
      text: "Step 12: Upon completion, we will proceed with account establishment, as indicated."
    },
    {
      image_url: "https://converter-effy.s3.ap-southeast-1.amazonaws.com/d696091c-529f-4efa-a593-33dcee459d00.jpg",
      text: ""
    },
    {
      image_url: "",
      text: "Step 13: We have filled in all the required information. Next, we should click on the 'Create' button to proceed to the next step."
    },
    {
      image_url: "",
      text: "Step 14: We need to select 'create' to establish our ID. This will serve as the sender ID for the following processes."
    },
    {
      image_url: "",
      text: "Step 15: We have received a verification email and we need to authenticate it immediately."
    },
    {
      image_url: "https://converter-effy.s3.ap-southeast-1.amazonaws.com/8b1d6021-df26-4e25-89b1-f10f0796eb5e.jpg",
      text: ""
    },
    {
      image_url: "",
      text: "Step 16: We will guide you through the process. Please refer to our sender ID provided here."
    },
    {
      image_url: "",
      text: "Step 17: We've successfully created it. Now, we can easily customize our email. Next, let's continue with creating our"
    },
    {
      image_url: "",
      text: "Step 18: To initiate the first email via SendGrid, we need to go back to the dashboard and proceed from there."
    },
    {
      image_url: "https://converter-effy.s3.ap-southeast-1.amazonaws.com/b80d3122-05a0-419f-ab63-2b666bb19f8d.jpg",
      text: ""
    },
    {
      image_url: "",
      text: "Step 19: We need to study this email feature and then send our first email. After that, let's proceed confidently."
    },
    {
      image_url: "",
      text: "Step 20: Once we've created our ID, we will simply click to proceed."
    },
    {
      image_url: "",
      text: "Step 21: After we successfully verify your email, we will direct you to the dashboard."
    },
    {
      image_url: "https://converter-effy.s3.ap-southeast-1.amazonaws.com/9ba03d14-aaa2-4bbe-bf2a-5cd3b1a076d8.jpg",
      text: ""
    },
    {
      image_url: "",
      text: "Step 22: We've successfully navigated to the dashboard. Now, let's focus on this specific location we're currently at."
    },
    {
      image_url: "",
      text: "Step 23: We will review our recent email history at this location. Therefore, to proceed with the creation process,"
    },
    {
      image_url: "",
      text: "Step 24: For successful email marketing strategies, we should create an engaging design."
    },
    {
      image_url: "https://converter-effy.s3.ap-southeast-1.amazonaws.com/1ed29e5a-623f-4616-a54b-063cb51e310f.jpg",
      text: ""
    },
    {
      image_url: "",
      text: "Step 25: We should select a template from the various SendGrid email templates available and then move on to the next step."
    },
    {
      image_url: "",
      text: "Step 26: We need to revise the email and then we will proceed to create a custom design."
    },
    {
      image_url: "",
      text: "Step 27: Start from this point, which represents the aesthetics and essence of our personal brand."
    },
    {
      image_url: "https://converter-effy.s3.ap-southeast-1.amazonaws.com/ac852111-1f93-4e98-9808-d5db0517f8af.jpg",
      text: ""
    },
    {
      image_url: "",
      text: "Step 28: We can start from the beginning if preferred. Our plan will involve us visiting."
    },
    {
      image_url: "",
      text: "Step 29: We will choose an email design from SendGrid due to their wide range of comprehensive layouts."
    },
    {
      image_url: "",
      text: "Step 30: If you're struggling to select an appropriate template, try this helpful strategy: actively participate in the selection process. It's important to be involved."
    },
    {
      image_url: "https://converter-effy.s3.ap-southeast-1.amazonaws.com/9c52af15-fb23-4dfa-817e-3c44f88d1cb9.jpg",
      text: ""
    },
    {
      image_url: "",
      text: "Step 31: We need to browse through these diverse categories. This selection covers all designs."
    },
    {
      image_url: "",
      text: "Step 32: We need to maintain a small-scale business model with a focus on providing seasonal restaurant experiences, using aromatic seasonings. We should leverage events such as Black Friday and seize opportunities in the travel industry. Moreover, we must execute strategic sales initiatives in the retail sector."
    },
    {
      image_url: "",
      text: "Step 33: We can select the correct template that suits our company's needs, regardless of its nature."
    },
    {
      image_url: "https://converter-effy.s3.ap-southeast-1.amazonaws.com/6dfae6ae-4493-4bc4-8ff7-452f09554cc5.jpg",
      text: ""
    },
    {
      image_url: "",
      text: "Step 34: From here onward, if any template doesn't meet your needs, we can proceed to design our own."
    },
    {
      image_url: "",
      text: "Step 35: We will select a template from the available options for the new design."
    }
  ]
}
const articleSlice = createSlice({
  name: "article",
  initialState,
  reducers: {}
});

export default articleSlice.reducer;
