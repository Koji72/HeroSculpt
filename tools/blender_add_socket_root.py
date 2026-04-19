"""
HeroSculpt — Add SOCKET_root to a part (hand, bracelet, accessory, etc.)

HOW TO USE:
  1. Open this script in Blender's Text Editor (Scripting workspace)
  2. Select the mesh object you want to add a socket to
  3. Move the 3D Cursor to the connection point (Shift+RightClick, or
     Shift+S > Cursor to Selected after selecting a vertex/edge/face)
  4. Run the script (Alt+P or the ▶ button)

The script creates an Empty named SOCKET_root at the cursor position,
parented to the selected mesh, and ready to export with the GLB.

SOCKET NAMING CONVENTION:
  SOCKET_root       — the single connection point of this part
                      (where it attaches to its parent socket on the torso)
"""

import bpy
import mathutils

SOCKET_NAME = "SOCKET_root"
EMPTY_SIZE  = 0.02   # visible size in Blender units — adjust to taste


def add_socket_at_cursor(obj: bpy.types.Object, socket_name: str) -> bpy.types.Object:
    """Create a Plain Axes empty at the 3D cursor, parented to obj."""
    cursor_pos = bpy.context.scene.cursor.location.copy()

    # Remove existing socket with same name on this object to avoid duplicates
    existing = bpy.data.objects.get(f"{obj.name}_{socket_name}")
    if not existing:
        # also check loose name
        existing = bpy.data.objects.get(socket_name)
    if existing and existing.parent == obj:
        bpy.data.objects.remove(existing, do_unlink=True)

    # Create the empty
    bpy.ops.object.empty_add(type='PLAIN_AXES', location=cursor_pos)
    empty = bpy.context.active_object
    empty.name = socket_name
    empty.empty_display_size = EMPTY_SIZE

    # Parent to the mesh (keep world transform)
    empty.parent = obj
    empty.matrix_parent_inverse = obj.matrix_world.inverted()

    return empty


def main():
    obj = bpy.context.active_object

    if obj is None or obj.type != 'MESH':
        raise RuntimeError("Select a MESH object first, then run this script.")

    socket = add_socket_at_cursor(obj, SOCKET_NAME)

    print(f"[HeroSculpt] SOCKET_root added to '{obj.name}' at {socket.location}")
    print(f"[HeroSculpt] Export the GLB and Three.js will detect this socket automatically.")


main()
