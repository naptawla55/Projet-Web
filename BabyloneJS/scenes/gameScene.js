function CreateGround(scene,BABYLON){
    const { Vector3, Texture, MeshBuilder, StandardMaterial } = BABYLON
    const ground= MeshBuilder.CreateGround("ground",{ width: 50, height: 50}, scene)

    const groundMat = new StandardMaterial("groundMat",scene)
    const diffuseTex = new Texture("./textures/groundTexDiffuse.jpg",scene)
    groundMat.diffuseTexture = diffuseTex

    ground.material = groundMat

}

async function gameScene(BABYLON,engine,currentScene){
    const {Vector3,Scene,MeshBuilder,StandardMaterial,FreeCamera,HemisphericLight} = BABYLON
    const scene= new Scene(engine)
    const cam= new FreeCamera("camera",new Vector3(0,0,-5),scene)


    const light = new HemisphericLight("lightsa",new Vector3(0,10,0), scene)
    const box= MeshBuilder.CreateBox("box",{ size: 1.5}, scene)
    CreateGround(scene,BABYLON)
    const ground = MeshBuilder.CreateGround("ground",{width: 50, height: 50}, scene)
    const cameraContainer = MeshBuilder.CreateGround("ground",{width: .5, height: .5}, scene)
    cameraContainer.position = new Vector3(0,15,0)
    cam.parent = cameraContainer
    cam.setTarget(new Vector3(0,-10,0))

    let camVertical = 0
    let camHorizontal = 0
    window.addEventListener("keydown", e => {
        const theKey = e.key.toLowerCase()

        if(theKey === "arrowup") camVertical = 1
        if(theKey === "arrowdown") camVertical = -1
        if(theKey === "arrowleft") camHorizontal = -1
        if(theKey === "arrowright") camHorizontal = 1

        cameraContainer.locallyTranslate(new Vector3(camHorizontal,0,camVertical))
    })
    window.addEventListener("keyup", e => {
        const theKey = e.key.toLowerCase()

        if(theKey === "arrowup") camVertical = 0
        if(theKey === "arrowdown") camVertical = 0
        if(theKey === "arrowleft") camHorizontal = 0
        if(theKey === "arrowright") camHorizontal = 0

    })
    await scene.whenReadyAsync()
    currentScene.dispose()
    return scene
    
}
export default gameScene