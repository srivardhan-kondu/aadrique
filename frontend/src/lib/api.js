import axios from "axios";
import { useQuery } from "@tanstack/react-query";

// An unset REACT_APP_BACKEND_URL used to produce "undefined/api/..." and break every
// request. Falling back to the current origin is the right default behind a reverse
// proxy that forwards /api to the backend.
const BASE = (process.env.REACT_APP_BACKEND_URL || "").replace(/\/+$/, "");
export const API = `${BASE}/api`;

const http = axios.create({ baseURL: API, timeout: 20000 });

const get = (path) => http.get(path).then((r) => r.data);

export const useServices = () =>
  useQuery({ queryKey: ["services"], queryFn: () => get("/services") });

export const useService = (slug) =>
  useQuery({ queryKey: ["service", slug], queryFn: () => get(`/services/${slug}`), enabled: !!slug });

export const useIndustries = () =>
  useQuery({ queryKey: ["industries"], queryFn: () => get("/industries") });

export const useIndustry = (slug) =>
  useQuery({ queryKey: ["industry", slug], queryFn: () => get(`/industries/${slug}`), enabled: !!slug });

export const useCaseStudies = () =>
  useQuery({ queryKey: ["case-studies"], queryFn: () => get("/case-studies") });

export const useCaseStudy = (slug) =>
  useQuery({ queryKey: ["case-study", slug], queryFn: () => get(`/case-studies/${slug}`), enabled: !!slug });

export const usePosts = () =>
  useQuery({ queryKey: ["posts"], queryFn: () => get("/posts") });

export const usePost = (slug) =>
  useQuery({ queryKey: ["post", slug], queryFn: () => get(`/posts/${slug}`), enabled: !!slug });

export const useFaqs = () =>
  useQuery({ queryKey: ["faqs"], queryFn: () => get("/faqs") });

export const useTestimonials = () =>
  useQuery({ queryKey: ["testimonials"], queryFn: () => get("/testimonials") });

export const submitContact = (payload) =>
  http.post("/contact", payload).then((r) => r.data);
