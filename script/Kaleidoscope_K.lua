local Kaleidoscope_K = {}

-- エラーハンドラ
local function error_handler(is_succeeded, func_name, error_mes) -- isSucceeded: boolean, func_name: string, error_mes: string
    if not is_succeeded then
        obj.setfont("游ゴシック", 50, 0, 0xff0000)
        obj.load("text", "["..func_name.."]\n"..error_mes)
        obj.draw()
        local RED = "\27[31m"
        local RESET = "\27[0m"
        io.stderr:write(RED .. "[" .. func_name .. "]" .. error_mes .. RESET)
    end
end

-- 2x2 z軸周りの回転行列
local function rot_mat(rad)
    return {math.cos(rad), math.sin(rad), -math.sin(rad), math.cos(rad)} -- column-major orderなので，11, 21, 12, 22の順
end

local GLShaderKit = require("GLShaderKit")
-- スクリプトのパスを取得 参考: https://github.com/Mr-Ojii/AviUtl-RotBlur_M-Script/blob/main/script/RotBlur_M.lua
local info = debug.getinfo(1, "S")
local script_path = info.source:match("@(.*[\\/])")

local shader_path = script_path.."Kaleidoscope_K.frag"

if GLShaderKit.isInitialized() then
    Kaleidoscope_K.kaleidoscope = function(center_x, center_y, size, rotation, floating_center, mirroring, scale, reload) -- center_x:number, center_y:number, size:number, rotation:number, floating_center:boolean, mirroring:number, scale:number, reload:boolean (変数のtype判定は用意していないので気を付けること)
        local is_succeeded, mes = pcall(function()
            local data, w, h = obj.getpixeldata()
            if w * h == 0 then
                error("Size of the image is zero.")
            end

            local pivot_x, pivot_y = w / 2, h / 2
            local tile_size = math.max(math.max(pivot_x, pivot_y) * size / 100, 1e-4)
            floating_center = floating_center and 1 or 0 -- 多分GLShaderKitにsetBooleranがない
            scale = math.max(scale / 100, 1e-4)

            GLShaderKit.activate()
            GLShaderKit.setPlaneVertex(1)
            GLShaderKit.setShader(shader_path, reload)
            -- 変数をセット
            GLShaderKit.setFloat("resolution", w, h)
            GLShaderKit.setFloat("pivot", pivot_x, pivot_y)
            GLShaderKit.setFloat("offset", center_x, center_y)
            GLShaderKit.setFloat("tile_size", tile_size)
            GLShaderKit.setInt("floating_center", floating_center)
            GLShaderKit.setInt("mirroring", mirroring)
            GLShaderKit.setFloat("scale", scale)
            GLShaderKit.setMatrix("rot_mat", "2x2", false, rot_mat(math.rad(rotation)))
            GLShaderKit.setMatrix("rot_mat_45", "2x2", false, rot_mat(math.rad(45)))
            GLShaderKit.setMatrix("rot_mat_neg45", "2x2", false, rot_mat(math.rad(-45)))
            GLShaderKit.setFloat("tan_22_5", math.tan(math.rad(22.5)))
            GLShaderKit.setFloat("tan_67_5", math.tan(math.rad(67.5)))
            GLShaderKit.setTexture2D(0, data, w, h)
            -- 描画
            GLShaderKit.draw("TRIANGLE_STRIP", data, w, h)
            GLShaderKit.deactivate()

            obj.putpixeldata(data)
        end)
        error_handler(is_succeeded, "Kaleidoscope_K.lua", mes)
    end
else
    Kaleidoscope_K.kaleidoscope = function(center_x, center_y, size, rotation, floating_center, mirroring, scale, reload)
        error_handler(false, "Kaleidoscope_K.lua", "GLShaderKit is not available.")
    end
end

return Kaleidoscope_K
