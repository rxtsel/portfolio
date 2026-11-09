---
translationKey: xavel
order: 19
locale: en
title: Xavel
description: Invoicing and payment collection for freelancers
href: https://xavel.app
sourceUrl: ""
logo: ../../../assets/projects/xavel.webp
detailPage: true
faviconBackground: none
screenshotOrientation: horizontal
screenshots:
  - src: ../../../assets/projects/xavel/dashboard.webp
    title: Invoicing dashboard
    alt: Dashboard showing plan usage, invoice statuses, amounts by currency and issuance activity.
  - src: ../../../assets/projects/xavel/new-invoice.webp
    title: Create an invoice
    alt: Form with client, currency, line items and an invoice preview.
  - src: ../../../assets/projects/xavel/email-composer.webp
    title: Send by email
    alt: Email composer with recipient, subject, message preview and the attached invoice PDF.
  - src: ../../../assets/projects/xavel/collect-payment-with-link.webp
    title: Invoice and payment activity
    alt: Issued invoice with a payment link, view and link-open counters, and an activity history.
  - src: ../../../assets/projects/xavel/public-invoice.webp
    title: The client's invoice
    alt: Public invoice showing line items, the total and actions to pay, download the PDF or report a payment.
  - src: ../../../assets/projects/xavel/invoices-list.webp
    title: Track invoices
    alt: List of draft, issued, paid and canceled invoices, with due dates and totals in different currencies.
  - src: ../../../assets/projects/xavel/payment-providers.webp
    title: Payment options
    alt: Settings for manual payments and payment providers, including Mercado Pago, Stripe, PayPal.me and Wompi.
publishDate: 2026-08-06
stack:
  - tanstack
  - react
  - typescript
  - tailwindcss
  - postgresql
  - playwright
  - vitest
  - redis
  - posthog
tags:
  - orpc
  - cloudflare
  - solid
  - cloudflare-r2
  - design-patterns
  - clean-code
  - ci-cd
  - vertical-slicing
  - clean-architecture
  - screaming-architecture
---

## The invoices I had to prepare every month

My clients and the company I work with needed a monthly invoice to pay my fees. I used a Google Sheets template and kept making the same edits: dates, billing periods, descriptions and client details. Working with clients in different countries also meant checking the currency.

Xavel started as a way to stop repeating that work. Its first name was Rxture. I built it for my own invoices, and it grew into a product other people use too.

## From preparing the invoice to tracking payment

In Xavel, I register clients once and reuse their details when preparing an invoice. I can review the document, issue it, email it with its PDF and track payment.

I kept those actions separate: issuing an invoice doesn't automatically create a payment request, and sending it doesn't change its financial status. An issued invoice can remain unpaid without being tied to a payment provider.

## Changing frameworks without rewriting invoicing

The first version used Next.js. I later moved to Svelte and also became too tightly coupled to a payment provider. Each change dragged more business logic along than it should have.

I reorganized the product into capability-based modules, including invoicing, clients and payments, with ports and adapters where I needed replaceable integrations. An invoice's rules don't depend on React, TanStack or a provider SDK. Persistence and provider-specific details stay in their adapters.

I chose TanStack Start for the current implementation. If I change the interface again, I want to keep the rules and use cases I've already worked out.

## Explicit contracts between the interface and server

With oRPC, I define each operation's inputs, outputs and errors before wiring up its handler. Those contracts provide types for consumers and validation on the server. Handlers delegate behavior to application use cases instead of holding the business rules themselves.

That also leaves room for other clients to consume the same operations without having to reproduce invoicing logic.

## Cases I didn't want to leave for later

- **Changing a client must not rewrite an issued invoice.** The invoice keeps snapshots of both billing parties. Its history doesn't depend on their profiles staying the same.
- **Two requests must not issue the same draft twice.** Issuance checks the state and saves conditionally against the draft. A request that loses that race gets an explicit result.
- **Currencies don't all work the same way.** Amounts use integer minor units, with different handling for currencies with and without decimals, such as USD and CLP.
- **Reporting a payment isn't proof it arrived.** A report stays pending until reviewed. If a provider has already confirmed payment, the review preserves that receipt rather than replacing it.

These behaviors have domain and application tests that run without starting the interface or connecting to a payment provider.
