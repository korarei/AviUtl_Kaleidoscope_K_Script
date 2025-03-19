#version 460 core

// 変数
in vec2 TexCoord;
layout(location = 0) out vec4 FragColor;

uniform sampler2D texture0;
uniform vec2 resolution;
uniform vec2 pivot;
uniform vec2 offset;
uniform float tile_size;
uniform int floating_center;
uniform int mirroring;
uniform float scale;
uniform mat2 rot_mat;
uniform mat2 rot_mat_45;
uniform mat2 rot_mat_neg45;
uniform float tan_22_5;
uniform float tan_67_5;

// xyをそれぞれrangeで分割しその領域に0,1,0,1...と番号を振ったvec2を返す．余りをremainderに格納
vec2 is_even(in vec2 value, in vec2 range, out vec2 remainder) {
    vec2 quotient = floor(value / range);
    remainder = value - quotient * range;
    return mod(quotient, 2.0);
}

// ミラーループ関数
vec2 mirror(in vec2 value, in vec2 range) {
    vec2 remainder;
    vec2 is_even = is_even(value, range, remainder);

    return mix(remainder, range - remainder, is_even);
}

// 以降は指定の形を作るための関数
vec2 wheel(in vec2 value, in float range) {
    vec2 remainder;
    vec2 is_even = is_even(value, vec2(range), remainder);
    vec2 result = mix(remainder, range - remainder, is_even);
    result = mix(result, result.yx, step(1.0, abs(is_even.x - is_even.y)));

    return result;
}

vec2 fish_head(in vec2 value, in float range) {
    vec2 remainder;
    vec2 is_even = is_even(value, vec2(range), remainder);
    vec2 result = mix(remainder, range - remainder, is_even);
    result = mix(result.yx, result, is_even.x);

    return result;
}

vec2 can_meas(in vec2 value, in float range) {
    vec2 remainder;
    vec2 is_even = is_even(value, vec2(range), remainder);
    vec2 result = mix(remainder, range - remainder, is_even);
    result = mix(result.yx, result, is_even.y);

    return result;
}

vec2 flip_flop(in vec2 value, in float range) {
    vec2 remainder;
    vec2 is_even = is_even(value, vec2(range), remainder);
    vec2 result = mix(remainder, range - remainder, vec2(is_even.x, 1.0));

    return result;
}

vec2 flower(in vec2 value, in float range) {
    vec2 unfold = mirror(value, vec2(range));
    return mix(unfold, unfold.yx, step(unfold.x, unfold.y));
}

vec2 dia_cross(in vec2 value, in float range) {
    return rot_mat_45 * mirror(rot_mat_neg45 * value, vec2(range));
}

vec2 flipper(in vec2 value, in float range) {
    vec2 remainder;
    vec2 is_even = is_even(value, vec2(range), remainder);
    vec2 result = mix(remainder, range - remainder, vec2(0.0, is_even.y));
    result.x = mix(result.x, range - result.x, is_even.y);

    return result;
}

vec2 starlish(in vec2 value, in float range) {
    vec2 unfold = mirror(value, vec2(range));
    vec2 flower_0 = flower(value, range);
    vec2 flower_45 = mix(rot_mat_45 * unfold.yx, rot_mat_45 * unfold, step(unfold.x, unfold.y));

    return mix(flower_45, flower_0, clamp(step(tan_22_5 * unfold.x, unfold.y) + step(unfold.y, tan_67_5 * unfold.x), 0.0, 1.0));
}

// メイン関数
void main() {
    vec2 rel_pos = (TexCoord * resolution - pivot - (floating_center != 0 ? offset: vec2(0.0))) / scale; // 原点を画像中心にする. TexCoord * resolutionはx:[0,w], y:[0,h]であることに注意
    // パターンごとに計算を行う
    vec2 local_pos;
    switch (mirroring) {
        case 1:
            local_pos = mirror(rel_pos, vec2(-tile_size));
            break;
        case 2:
            local_pos = wheel(rel_pos, -tile_size);
            break;
        case 3:
            local_pos = fish_head(rel_pos, -tile_size);
            break;
        case 4:
            local_pos = can_meas(rel_pos, -tile_size);
            break;
        case 5:
            local_pos = flip_flop(rel_pos, -tile_size);
            break;
        case 6:
            local_pos = flower(rel_pos, -tile_size);
            break;
        case 7:
            local_pos = dia_cross(rel_pos, -tile_size);
            break;
        case 8:
            local_pos = flipper(rel_pos, -tile_size);
            break;
        case 9:
            local_pos = starlish(rel_pos, -tile_size);
            break;
        default:
            local_pos = rel_pos;
            break;
    }
    local_pos = rot_mat * local_pos; // 回転行列をかける(非可換) 転置なら *= rot_mat でも可
    vec2 src_pos = mirror(local_pos + pivot + offset, resolution); // 中心を左上に戻す
    
    FragColor = texture(texture0, src_pos / resolution); // src_posは正規化される
}
