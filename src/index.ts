import { Color4 } from '@dcl/sdk/math'
import { engine, Entity, InputAction, InputModifier, Material, PBInputModifier, pointerEventsSystem } from '@dcl/sdk/ecs'

export function main() {
    const arrowNames = ["Left", "Down", "Up", "Right"] as const;
    type ArrowName = typeof arrowNames[number];
    const arrowTexture = Material.Texture.Common({ src: "assets/scene/Images/arrow.png" })

    const upMaterial = {
        texture: arrowTexture,
        albedoColor: Color4.White()
    }

    const downMaterial = {
        texture: arrowTexture,
        albedoColor: Color4.Red()
    }

    let arrows: Record<ArrowName, Entity>

    {
        const arrowsPartial: Partial<typeof arrows> = { }

        for (let i = 0; i < arrowNames.length; i++) {
            let entity = engine.getEntityOrNullByName(arrowNames[i])
    
            if (entity == null)
                throw new Error(`${arrowNames[i]} is null`)

            arrowsPartial[arrowNames[i]] = entity;
        }

        arrows = arrowsPartial as typeof arrows
    }

    const hitBox = engine.getEntityOrNullByName("HitBox")

    if (hitBox == null)
        throw new Error("HitBox is null")

    const pointerData = {
        entity: hitBox,
        opts: {
            hoverText: ""
        }
    }

    const moveEnabled = InputModifier.Mode.Standard({
        disableWalk: false,
        disableRun: false,
        disableJog: false,
        disableJump: false
    })

    const moveDisabled = InputModifier.Mode.Standard({
        disableWalk: true,
        disableRun: true,
        disableJog: true,
        disableJump: true
    })

    InputModifier.create(engine.PlayerEntity, {
        mode : moveEnabled
    })

    pointerEventsSystem.onPointerDown(pointerData, cmd => {
        switch (cmd.button) {
            case InputAction.IA_PRIMARY:
                const inputModifier = InputModifier.getMutable(engine.PlayerEntity)

                if (inputModifier.mode == moveEnabled)
                    inputModifier.mode = moveDisabled
                else
                    inputModifier.mode = moveEnabled

                break
            case InputAction.IA_LEFT:
                Material.setPbrMaterial(arrows.Left, downMaterial)
                break
            case InputAction.IA_BACKWARD:
                Material.setPbrMaterial(arrows.Down, downMaterial)
                break
            case InputAction.IA_FORWARD:
                Material.setPbrMaterial(arrows.Up, downMaterial)
                break
            case InputAction.IA_RIGHT:
                Material.setPbrMaterial(arrows.Right, downMaterial)
                break
        }
    })

    pointerEventsSystem.onPointerUp(pointerData, cmd => {
        switch (cmd.button) {
            case InputAction.IA_LEFT:
                Material.setPbrMaterial(arrows.Left, upMaterial)
                break
            case InputAction.IA_BACKWARD:
                Material.setPbrMaterial(arrows.Down, upMaterial)
                break
            case InputAction.IA_FORWARD:
                Material.setPbrMaterial(arrows.Up, upMaterial)
                break
            case InputAction.IA_RIGHT:
                Material.setPbrMaterial(arrows.Right, upMaterial)
                break
        }
    })
}