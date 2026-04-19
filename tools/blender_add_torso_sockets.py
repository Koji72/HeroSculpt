"""
HeroSculpt — Auto-add all attachment sockets to a TORSO mesh

HOW TO USE:
  1. Open this script in Blender's Text Editor (Scripting workspace)
  2. Select the torso mesh object
  3. Run the script (Alt+P or the ▶ button)
  4. Empties appear at estimated positions — tweak them by hand if needed
  5. Export the GLB normally (empties are included automatically)

SOCKET NAMING CONVENTION (what Three.js will look for):
  SOCKET_neck           — base of neck / head attachment
  SOCKET_wrist_left     — left wrist / hand or bracelet attachment
  SOCKET_wrist_right    — right wrist / hand or bracelet attachment
  SOCKET_shoulder_left  — left shoulder pad / forearm attachment
  SOCKET_shoulder_right — right shoulder pad / forearm attachment
  SOCKET_chest          — chest symbol / chest belt attachment
  SOCKET_belt           — belt attachment (waist level)
  SOCKET_cape           — cape attachment (upper back)

HOW THE ESTIMATION WORKS:
  The script reads the bounding box of the mesh and places sockets at
  anatomically plausible fractions of the height and width.
  These are good starting points — move them to exact positions afterwards.
"""

import bpy
import mathutils

EMPTY_SIZE = 0.02


# Fractions of bounding-box dimensions for each socket.
# (x_frac, y_frac, z_frac) where 0=min, 1=max on each axis.
# Blender: X=right, Y=forward/back, Z=up
SOCKET_ESTIMATES = {
    "SOCKET_neck":           ( 0.50,  0.50,  0.88),   # top-center
    "SOCKET_chest":          ( 0.50,  0.10,  0.72),   # front-center, upper chest
    "SOCKET_cape":           ( 0.50,  0.90,  0.80),   # back-center, upper back
    "SOCKET_shoulder_left":  ( 0.85,  0.50,  0.82),   # left side, shoulder height
    "SOCKET_shoulder_right": ( 0.15,  0.50,  0.82),   # right side
    "SOCKET_wrist_left":     ( 1.10,  0.50,  0.55),   # beyond left edge (arm extended)
    "SOCKET_wrist_right":    (-0.10,  0.50,  0.55),   # beyond right edge
    "SOCKET_belt":           ( 0.50,  0.25,  0.42),   # front-center, waist
}


def get_world_bbox(obj: bpy.types.Object):
    """Return (min, max) as mathutils.Vector in world space."""
    corners = [obj.matrix_world @ mathutils.Vector(c) for c in obj.bound_box]
    mn = mathutils.Vector((min(c.x for c in corners),
                            min(c.y for c in corners),
                            min(c.z for c in corners)))
    mx = mathutils.Vector((max(c.x for c in corners),
                            max(c.y for c in corners),
                            max(c.z for c in corners)))
    return mn, mx


def lerp3(mn, mx, fx, fy, fz):
    """Interpolate between bounding-box min/max with fractions (may exceed 0-1)."""
    return mathutils.Vector((
        mn.x + (mx.x - mn.x) * fx,
        mn.y + (mx.y - mn.y) * fy,
        mn.z + (mx.z - mn.z) * fz,
    ))


def add_socket(obj, name, location):
    """Remove any existing socket with this name on obj, then create a new one."""
    for child in list(obj.children):
        if child.name == name:
            bpy.data.objects.remove(child, do_unlink=True)

    bpy.ops.object.empty_add(type='PLAIN_AXES', location=location)
    empty = bpy.context.active_object
    empty.name = name
    empty.empty_display_size = EMPTY_SIZE
    empty.parent = obj
    empty.matrix_parent_inverse = obj.matrix_world.inverted()
    return empty


def main():
    obj = bpy.context.active_object

    if obj is None or obj.type != 'MESH':
        raise RuntimeError("Select the TORSO MESH first, then run this script.")

    mn, mx = get_world_bbox(obj)
    created = []

    for socket_name, (fx, fy, fz) in SOCKET_ESTIMATES.items():
        loc = lerp3(mn, mx, fx, fy, fz)
        empty = add_socket(obj, socket_name, loc)
        created.append((socket_name, empty.location.copy()))
        print(f"[HeroSculpt] {socket_name:30s} → {empty.location}")

    print(f"\n[HeroSculpt] {len(created)} sockets added to '{obj.name}'.")
    print("[HeroSculpt] Review positions in the viewport and adjust if needed.")
    print("[HeroSculpt] Then export as GLB — sockets are included automatically.")


main()
