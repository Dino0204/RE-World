import { test, expect } from "@playwright/test";

/**
 * 플레이어 조작 및 상태 변화를 검증하는 E2E 테스트입니다.
 */
test.describe("플레이어 컨트롤 테스트", () => {
  test.beforeEach(async ({ page }) => {
    // 게임 페이지로 이동
    await page.goto("/");

    // 로딩 화면이 사라질 때까지 대기 (최대 60초)
    const loadingScreen = page.locator("text=Loading Assets");
    await loadingScreen.waitFor({ state: "detached", timeout: 60000 });

    // 캔버스가 렌더링되었는지 확인
    const canvas = page.locator("canvas");
    await expect(canvas).toBeVisible();
  });

  test("W 키를 입력했을 때 플레이어가 이동해야 함", async ({ page }) => {
    // 키 입력 전 상태 확인 (필요한 경우 window 객체를 통해 상태를 노출시켜야 함)
    // 현재는 코드 수정 없이 조작이 발생하는지만 확인합니다.

    await page.keyboard.down("w");
    await page.waitForTimeout(500); // 0.5초 동안 이동 시뮬레이션
    await page.keyboard.up("w");

    // TODO: 플레이어의 좌표 변화나 이동 상태(isMoving)를 검증하는 로직 추가 필요
    // 예: const isMoving = await page.evaluate(() => window.playerStore.getState().isMoving);
    // expect(isMoving).toBe(true);
  });

  test("Space 키를 입력했을 때 플레이어가 점프해야 함", async ({ page }) => {
    await page.keyboard.press(" ");

    // TODO: 점프 상태(isJumping)를 검증하는 로직 추가 필요
  });

  test("1 키를 입력했을 때 무기가 장착되어야 함", async ({ page }) => {
    await page.keyboard.press("1");

    // TODO: 장착된 아이템 목록(equippedItems)을 검증하는 로직 추가 필요
  });

  test("V 키를 입력했을 때 카메라 모드가 변경되어야 함", async ({ page }) => {
    await page.keyboard.press("v");

    // TODO: 카메라 모드(cameraMode)를 검증하는 로직 추가 필요
  });

  test("마우스 우클릭 시 조준 상태가 되어야 함", async ({ page }) => {
    // 캔버스 중앙 클릭하여 포인터 잠금 활성화
    await page.mouse.click(500, 500);

    // 마우스 우클릭 시뮬레이션
    await page.mouse.down({ button: "right" });
    await page.waitForTimeout(100);

    // TODO: 조준 상태(isAiming)를 검증하는 로직 추가 필요

    await page.mouse.up({ button: "right" });
  });
});
