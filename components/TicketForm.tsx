"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z
    .string()
    .optional()
    .transform((value) => value?.trim() ?? ""),
  device: z.string().min(2, "Device make/model is required"),
  category: z.string().min(2, "Select an issue"),
  description: z.string().min(10, "Tell us a bit more about what happened"),
  locationId: z.string().min(1, "Choose a preferred location"),
  consent: z.boolean().refine((value) => value, { message: "Consent is required" }),
});

export type TicketFormValues = z.infer<typeof schema>;

interface TicketFormProps {
  categories: string[];
  locations: Array<{ id: string; name: string }>;
}

interface TicketResponse {
  ticketId: string;
  summary: string;
  nextSteps: string;
}

export function TicketForm({ categories, locations }: TicketFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TicketFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      consent: false,
    },
  });

  const [result, setResult] = useState<TicketResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function onSubmit(values: TicketFormValues) {
    setErrorMessage(null);
    setResult(null);

    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "ticket",
          payload: values,
        }),
      });

      if (!response.ok) {
        throw new Error(`Support ticket failed with status ${response.status}`);
      }

      const data = (await response.json()) as TicketResponse;
      setResult(data);

      const locationMatch = locations.find((item) => item.id === values.locationId);
      const locationName = locationMatch?.name ?? values.locationId;

      const logResponse = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketId: data.ticketId,
          name: values.name,
          email: values.email,
          device: values.device,
          category: values.category,
          location: locationName,
        }),
      });

      if (!logResponse.ok) {
        throw new Error(`Ticket logging failed with status ${logResponse.status}`);
      }

      reset({
        name: "",
        email: "",
        phone: "",
        device: "",
        category: "",
        description: "",
        locationId: "",
        consent: true,
      });
    } catch (error) {
      console.error("Ticket submission error", error);
      setErrorMessage("We could not submit your ticket right now. Please try again.");
    }
  }

  return (
    <Card className="h-full border-border/60">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Start a ticket</CardTitle>
        <p className="text-sm text-muted-foreground">
          Fill in a few details and we will send you a ticket number with a summary of next steps.
        </p>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="name">
                Name
              </label>
              <Input id="name" placeholder="Your name" {...register("name")} />
              {errors.name ? <p className="text-xs text-destructive">{errors.name.message}</p> : null}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">
                Email
              </label>
              <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
              {errors.email ? <p className="text-xs text-destructive">{errors.email.message}</p> : null}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="phone">
                Phone (optional)
              </label>
              <Input id="phone" placeholder="Optional" {...register("phone")} />
              {errors.phone ? <p className="text-xs text-destructive">{errors.phone.message}</p> : null}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="device">
                Device make & model
              </label>
              <Input id="device" placeholder="e.g., iPhone 17 Pro" {...register("device")} />
              {errors.device ? <p className="text-xs text-destructive">{errors.device.message}</p> : null}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="category">
                    Issue category
                  </label>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Pick a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category ? <p className="text-xs text-destructive">{errors.category.message}</p> : null}
                </div>
              )}
            />
            <Controller
              name="locationId"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="location">
                    Preferred location
                  </label>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="location">
                      <SelectValue placeholder="Choose a store" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.locationId ? <p className="text-xs text-destructive">{errors.locationId.message}</p> : null}
                </div>
              )}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="description">
              What happened?
            </label>
            <Textarea
              id="description"
              rows={4}
              placeholder="Example: Dropped phone on tile; front glass shattered and Face ID stopped working."
              {...register("description")}
            />
            {errors.description ? <p className="text-xs text-destructive">{errors.description.message}</p> : null}
          </div>
          <Controller
            name="consent"
            control={control}
            render={({ field }) => (
              <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/30 p-4">
                <Checkbox
                  id="consent"
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                />
                <label htmlFor="consent" className="text-sm text-muted-foreground">
                  I consent to The Fix contacting me via email or phone about this request.
                </label>
              </div>
            )}
          />
          {errors.consent ? <p className="text-xs text-destructive">{errors.consent.message}</p> : null}
          <Button type="submit" disabled={isSubmitting} className="rounded-xl">
            {isSubmitting ? "Submitting..." : "Submit ticket"}
          </Button>
          {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}
        </form>

        {result ? (
          <div className="mt-6 space-y-3 rounded-2xl border border-fix-blue/30 bg-fix-blue/10 p-5 text-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-fix-blue">
              Ticket #{result.ticketId}
            </p>
            <p className="text-base font-medium text-foreground">{result.summary}</p>
            <p className="text-muted-foreground">{result.nextSteps}</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}



