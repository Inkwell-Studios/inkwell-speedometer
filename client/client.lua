local isSpeedometerVisible = false

-- Function to convert vehicle speed to MPH
local function GetVehicleSpeedMPH(vehicle)
    local speed = GetEntitySpeed(vehicle)
    return speed * 2.236936 -- Convert from m/s to mph
end

-- Function to get current gear
local function GetVehicleGear(vehicle)
    local gear = GetVehicleCurrentGear(vehicle)
    if gear == 0 then
        return 'R'
    elseif gear == 1 and GetEntitySpeedVector(vehicle, true).y < 0 then
        return 'R'
    else
        return tostring(gear)
    end
end

-- Function to get RPM
local function GetVehicleRPM(vehicle)
    return math.floor(GetVehicleCurrentRpm(vehicle) * 9000)
end

-- Function to get fuel level (0-100)
local function GetVehicleFuel(vehicle)
    -- Try to get fuel level natively first
    local fuel = GetVehicleFuelLevel(vehicle)
    
    -- If fuel is unavailable, simulate it based on entity health
    if not fuel or fuel <= 0 then
        local health = GetEntityHealth(vehicle)
        local maxHealth = GetEntityMaxHealth(vehicle)
        fuel = (health / maxHealth) * 100
    end
    
    return math.min(math.max(fuel, 0), 100)
end

-- Function to check current driving status and update UI
local function UpdateSpeedometerVisibility()
    local ped = PlayerPedId()
    local shouldBeVisible = false

    if IsPedInAnyVehicle(ped, false) then
        local currentVehicle = GetVehiclePedIsIn(ped, false)
        if GetPedInVehicleSeat(currentVehicle, -1) == ped then
            shouldBeVisible = true
        end
    end

    -- Check if state needs to change
    if shouldBeVisible ~= isSpeedometerVisible then
        isSpeedometerVisible = shouldBeVisible
        SendNUIMessage({
            type = 'setVisible',
            data = isSpeedometerVisible
        })
        print(string.format('[Speedo Client] Visibility changed. Sending setVisible: %s', tostring(isSpeedometerVisible)))
    end
    
    return isSpeedometerVisible, GetVehiclePedIsIn(ped, false) -- Return visibility and vehicle (if any)
end

-- Handle the UI Ready message
RegisterNUICallback('uiReady', function(data, cb)
    print('[Speedo Client] UI is ready. Sending initial visibility state.')
    UpdateSpeedometerVisibility() -- Send initial state
    cb('ok') -- Acknowledge the callback
end)

-- Main thread
Citizen.CreateThread(function()
    while true do
        local sleep = 1000
        local currentlyVisible, currentVehicle = UpdateSpeedometerVisibility()

        if currentlyVisible then
            sleep = 200 -- Keep user-defined sleep time
            
            -- Send Vehicle Data only if Visible and Driving
            if currentVehicle then 
                SendNUIMessage({
                    type = 'updateVehicleData',
                    speed = GetVehicleSpeedMPH(currentVehicle),
                    gear = GetVehicleGear(currentVehicle),
                    rpm = GetVehicleRPM(currentVehicle),
                    fuel = GetVehicleFuel(currentVehicle)
                })
            end
        end

        Citizen.Wait(sleep)
    end
end) 