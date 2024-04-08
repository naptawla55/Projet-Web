async function gameScene(BABYLON,engine,currentScene){
    const {Vector3,Scene,MeshBuilder,StandardMaterial,FreeCamera,HemisphericLight} = BABYLON
    const scene= new Scene(engine)
    const cam= new FreeCamera("camera",new Vector3(0,0,-5),scene)
    cam.attachControl()

    const light = new HemisphericLight("lightsa",new Vector3(0,10,0), scene)
    const box= MeshBuilder.CreateBox("box",{ size: 1.5}, scene)

    await scene.whenReadyAsync()
    currentScene.dispose()
    return scene
    
}
export default gameScene