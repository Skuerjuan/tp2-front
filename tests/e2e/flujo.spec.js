import { test, expect } from "@playwright/test";

test("flujo", async ({ page }) => {

    await page.goto("http://localhost:3000/auth/sign-in");

    await page.getByTestId("email").fill("playwright@gmail.com");
    await page.getByTestId("password").fill("playwright123_");

    await page.getByRole("button", { name: "Ingresar" }).click();

    await page.waitForURL(/\/$/);

  await expect(page.getByText("Recomendaciones")).toBeVisible();

    await page.getByTestId("libros").click();

    await expect(page).toHaveURL(/\/libros/);

    await expect(page.getByText("Cargando reseñas...")).toBeHidden();

    const targetCard = page
        .locator(".tarjeta")
        .filter({ hasText: "Marcar como leído" })
        .first();

    const title = await targetCard.locator("h3").innerText();

    const button = targetCard.getByRole("button", { name: /marcar como leído/i });

    await button.click();

    await expect(targetCard.locator("h3")).toHaveText(title);

    await page.getByTestId("leidos").click();

    await expect(page.getByTestId("book-card").filter({ hasText: title }).first()).toBeVisible()
});