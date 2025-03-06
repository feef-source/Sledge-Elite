import { text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// No persistent storage needed for this application
// but keeping the schema file as per guidelines
