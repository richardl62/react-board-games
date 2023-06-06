import { ServerData } from "../server-side/server-data";

type FacesAndHeld = Pick<ServerData, "faces" | "held">;

/** Return a copy of the faces and held arrays with the held faces sorted and moved
to the start of the array.
*/
export function moveHeldFacesToStart({faces, held}: FacesAndHeld): FacesAndHeld {
    const newFaces = [];
    const newHeld = [];
    for (let i = 0; i < faces.length; i++) {
        if (held[i]) {
            newFaces.push(faces[i]);
            newHeld.push(held[i]);
        }
    }
    newFaces.sort();

    for (let i = 0; i < faces.length; i++) {
        if (!held[i]) {
            newFaces.push(faces[i]);
            newHeld.push(held[i]);
        }
    }

    return {faces: newFaces, held: newHeld};
}
