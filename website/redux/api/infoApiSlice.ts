import { apiSlice } from "./apiSlice";

const infoApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // send new letter
    sendNewLetter: builder.mutation({
      query: (body) => ({
        url: "/info/newsletter",
        method: "POST",
        body,
      }),
    }),

    // send career application
    sendCareerApplication: builder.mutation({
      query: (body) => ({
        url: "/info/careers-apply",
        method: "POST",
        body,
      }),
    }),

    // send expert consultation
    consultExpert: builder.mutation({
      query: (body) => ({
        url: "/info/consult-expert",
        method: "POST",
        body,
      }),
    }),

    uploadFile: builder.mutation({
      query: (body) => ({
        url: "/section/upload-file",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useSendNewLetterMutation,
  useSendCareerApplicationMutation,
  useConsultExpertMutation,
  useUploadFileMutation,
} = infoApiSlice;
