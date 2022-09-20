/*** Check arrays, which can be multi-dimensional, have the same size and connent.
 * 
 *  More precisely, the input are compared element by element. In general 
 *  standard (===) comparision is used.  But if both elements are arrays, a 
 *  recursive call to this function is used.
 */
export function sameNestedArray<T>(a1: T[], a2: T[]) : boolean {
    const length = a1.length;
    if (a2.length !== length) {
        return false;
    }

    const sameElement = (e1: T, e2: T) => {
        if(e1 === e2) {
            return true;
        }

        if(Array.isArray(e1) && Array.isArray(e2)) {
            return sameNestedArray(e1, e2);
        }

        return false;
    };

    for (let ind = 0; ind < length; ind++) {
        if(!sameElement(a1[ind], a2[ind])) {
            return false;
        }
    }

    return true;
}