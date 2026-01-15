# 💡 Core Concepts (주요 개념)

이 프로젝트를 이해하기 위해 꼭 알아야 하는 핵심 FPS 로직과 물리 개념입니다.

## 1. 3D 좌표계와 물리 (Rapier)

- **RigidBody**: 물리 엔진의 통제를 받는 "단단한 물체"입니다. 플레이어는 회전이 고정된(`lockRotations`) 캡슐 형태의 RigidBody입니다.
- **Velocity (속도)**: 플레이어의 이동은 `setLinvel`을 통해 직접적으로 속도를 제어합니다.
- **Gravity (중력)**: 프로젝트 전체에 `[0, -20, 0]`의 중력이 적용되어 있으며, 점프 시 위쪽 방향으로 힘(`jumpForce`)을 가합니다.

## 2. 플레이어 제어 (Player Control)

### 카메라 모드 (`CameraMode`)

- **1인칭 (FIRST_PERSON)**: 카메라가 플레이어 위치에 고정됩니다.
- **3인칭 (THIRD_PERSON)**: 카메라가 플레이어 뒤쪽에서 일정 거리와 높이를 유지하며 따라다닙니다. `slerp`나 `applyQuaternion`을 사용하여 부드러운 카메라 이동을 구현합니다.

### 이동 로직

1. 사용자의 입력(WASD)을 벡터로 변환합니다.
2. 현재 카메라가 바라보고 있는 방향(`camera.getWorldDirection`)을 기준으로 이동 벡터를 회전시킵니다.
3. 계산된 벡터에 `speed`를 곱해 RigidBody의 속도로 설정합니다.

## 3. 사격 시스템 (Shooting Flow)

1. **입력 감지**: 마우스 클릭 시 `mousedown` 이벤트가 발생합니다.
2. **발사 위치 계산**: 카메라의 위치와 방향(`getWorldDirection`)을 기반으로 총알이 생성될 좌표를 계산합니다.
3. **전역 상태 업데이트**: `useBulletStore`(Zustand)에 새로운 총알 데이터를 추가합니다.
4. **일괄 렌더링**: `BulletManager`가 스토어를 구독하고 있다가, 등록된 모든 총알을 물리 엔진과 함께 렌더링합니다.

## 4. 프레임 단위 처리 (`useFrame`)

`useFrame`은 게임의 심장부입니다. 매 프레임(약 16.6ms)마다 다음을 실행합니다:

- 플레이어의 현재 속도 업데이트
- 카메라 위치 동기화
- 캐릭터가 바라보는 방향(`lookAt`) 조정
