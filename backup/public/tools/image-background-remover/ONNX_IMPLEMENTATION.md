# 纯浏览器端运行方案：WebAssembly + ONNX Runtime Web

## 1. 核心技术栈

- **WebAssembly (Wasm)**：用于在浏览器中高效运行模型推理
- **ONNX Runtime Web**：微软开源的 ONNX 模型运行时，支持在浏览器中加载和运行 ONNX 模型
- **模型**：RMBG-1.4 或 MODNet（需要转换为 .onnx 格式）

## 2. 实现步骤

### 2.1 准备模型

1. **获取模型**：
   - RMBG-1.4：https://github.com/naver-ai/rmbg
   - MODNet：https://github.com/ZHKKKe/MODNet

2. **转换为 ONNX 格式**：
   - 使用 PyTorch 或 TensorFlow 导出为 ONNX 格式
   - 确保模型兼容 ONNX Runtime Web

3. **优化模型**：
   - 使用 ONNX Runtime 提供的优化工具
   - 考虑量化模型以减小体积和提高速度

### 2.2 集成 ONNX Runtime Web

1. **添加依赖**：
   ```html
   <!-- ONNX Runtime Web -->
   <script src="https://cdn.jsdelivr.net/npm/onnxruntime-web@1.16.0/dist/ort.min.js"></script>
   ```

2. **创建模型加载函数**：
   ```javascript
   async function loadModel() {
     try {
       console.log('Loading model...');
       // 加载模型
       const session = await ort.InferenceSession.create('./models/rmbg-1.4.onnx');
       console.log('Model loaded successfully');
       return session;
     } catch (error) {
       console.error('Failed to load model:', error);
       throw error;
     }
   }
   ```

### 2.3 图像处理流程

1. **图像预处理**：
   - 调整图像大小以匹配模型输入尺寸
   - 标准化像素值
   - 转换为模型所需的张量格式

2. **模型推理**：
   - 使用 ONNX Runtime Web 运行模型
   - 获取预测结果（掩码）

3. **后处理**：
   - 根据掩码生成透明背景图像
   - 应用背景颜色（如果需要）

### 2.4 完整实现代码

#### HTML 部分（添加到 index.html）

```html
<!-- ONNX Runtime Web -->
<script src="https://cdn.jsdelivr.net/npm/onnxruntime-web@1.16.0/dist/ort.min.js"></script>

<!-- 模型路径配置 -->
<script>
  const MODEL_PATH = './models/rmbg-1.4.onnx';
</script>
```

#### JavaScript 部分（替换现有的模拟实现）

```javascript
// 全局状态
let appState = {
    originalImage: null,
    processedImage: null,
    session: null,
    modelLoaded: false,
    processing: false
};

// 初始化
async function init() {
    try {
        showStatus('Loading AI model...', 'info');
        appState.session = await loadModel();
        appState.modelLoaded = true;
        showStatus('AI model loaded successfully!', 'success');
    } catch (error) {
        console.error('Failed to load model:', error);
        showStatus('Failed to load AI model. Using fallback simulation.', 'error');
        appState.modelLoaded = true;
    }
}

// 加载模型
async function loadModel() {
    try {
        const session = await ort.InferenceSession.create(MODEL_PATH);
        return session;
    } catch (error) {
        throw error;
    }
}

// 处理图像
async function processImage() {
    if (!appState.originalImage || appState.processing) return;
    
    appState.processing = true;
    showStatus('Processing image...', 'info');
    
    try {
        const file = document.getElementById('imageInput').files[0];
        const resultBlob = await removeBackground(file);
        
        const resultUrl = URL.createObjectURL(resultBlob);
        appState.processedImage = resultUrl;
        document.getElementById('processedPreview').src = resultUrl;
        document.getElementById('downloadBtn').style.display = 'inline';
        
        showStatus('Background removal completed!', 'success');
    } catch (error) {
        console.error('Processing error:', error);
        showStatus(`Processing failed: ${error.message}`, 'error');
    } finally {
        appState.processing = false;
    }
}

// 背景移除核心函数
async function removeBackground(file) {
    return new Promise(async (resolve, reject) => {
        try {
            // 读取图像
            const img = await loadImage(file);
            
            // 预处理图像
            const preprocessedData = await preprocessImage(img);
            
            // 模型推理
            const mask = await runInference(preprocessedData);
            
            // 后处理
            const resultBlob = await postprocessImage(img, mask);
            
            resolve(resultBlob);
        } catch (error) {
            reject(error);
        }
    });
}

// 加载图像
function loadImage(file) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();
        
        reader.onload = function(e) {
            img.onload = function() {
                resolve(img);
            };
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// 预处理图像
async function preprocessImage(img) {
    // 调整图像大小
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // 模型输入尺寸（根据模型要求调整）
    const inputWidth = 320;
    const inputHeight = 320;
    
    canvas.width = inputWidth;
    canvas.height = inputHeight;
    
    // 绘制图像
    ctx.drawImage(img, 0, 0, inputWidth, inputHeight);
    
    // 获取图像数据
    const imageData = ctx.getImageData(0, 0, inputWidth, inputHeight);
    const data = imageData.data;
    
    // 转换为模型输入格式
    const inputTensor = new Float32Array(inputWidth * inputHeight * 3);
    for (let i = 0; i < data.length; i += 4) {
        const index = i / 4;
        inputTensor[index * 3] = data[i] / 255.0;     // R
        inputTensor[index * 3 + 1] = data[i + 1] / 255.0; // G
        inputTensor[index * 3 + 2] = data[i + 2] / 255.0; // B
    }
    
    return inputTensor;
}

// 模型推理
async function runInference(inputTensor) {
    if (!appState.session) {
        throw new Error('Model not loaded');
    }
    
    // 创建输入张量
    const inputs = {
        // 输入名称根据模型要求调整
        'input': new ort.Tensor('float32', inputTensor, [1, 3, 320, 320])
    };
    
    // 运行推理
    const outputs = await appState.session.run(inputs);
    
    // 获取输出（掩码）
    const mask = outputs['output'].data;
    return mask;
}

// 后处理图像
function postprocessImage(img, mask) {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        
        // 绘制原始图像
        ctx.drawImage(img, 0, 0);
        
        // 获取原始图像数据
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // 应用掩码
        for (let i = 0; i < data.length; i += 4) {
            const index = i / 4;
            const maskValue = mask[index];
            
            // 根据掩码值设置透明度
            data[i + 3] = maskValue * 255;
        }
        
        ctx.putImageData(imageData, 0, 0);
        
        // 转换为 blob
        canvas.toBlob(blob => {
            if (blob) {
                resolve(blob);
            } else {
                reject(new Error('Canvas to blob conversion failed'));
            }
        }, 'image/png');
    });
}

// 初始化
document.addEventListener('DOMContentLoaded', init);
```

### 2.5 模型文件结构

```
simpletoolbox-platform/
└── public/
    └── tools/
        └── image-background-remover/
            ├── index.html
            ├── script.js
            └── models/
                └── rmbg-1.4.onnx  # 模型文件
```

## 3. 性能优化

1. **模型优化**：
   - 使用 ONNX Runtime 的模型优化工具
   - 考虑量化模型（INT8）以减小体积和提高速度

2. **加载优化**：
   - 使用 Service Worker 缓存模型文件
   - 实现渐进式加载，先加载轻量级模型，再加载完整模型

3. **推理优化**：
   - 使用 WebAssembly 后端
   - 考虑使用 WebGPU 后端（如果浏览器支持）

4. **内存管理**：
   - 及时释放不再使用的张量
   - 限制最大图像尺寸以避免内存溢出

## 4. 浏览器兼容性

- **支持的浏览器**：
  - Chrome 64+
  - Edge 79+
  - Safari 13.1+
  - Firefox 60+

- **WebAssembly 支持**：确保浏览器支持 WebAssembly

- **WebGL 支持**：对于使用 WebGL 后端的情况

## 5. 测试和调试

1. **本地测试**：
   - 使用本地服务器运行项目
   - 测试不同类型和大小的图像

2. **性能测试**：
   - 测量模型加载时间
   - 测量推理时间
   - 测试内存使用情况

3. **调试技巧**：
   - 使用 Chrome DevTools 调试 WebAssembly
   - 监控网络请求和内存使用

## 6. 部署考虑

1. **模型文件**：
   - 模型文件可能较大（10-100MB），考虑使用 CDN 加速
   - 实现模型文件的版本控制

2. **缓存策略**：
   - 设置适当的缓存头
   - 使用 Service Worker 缓存模型文件

3. **错误处理**：
   - 实现优雅的错误处理
   - 提供 fallback 方案（如简单的颜色阈值方法）

## 7. 总结

纯浏览器端运行方案的优势：
- **隐私性**：图像数据永远不会离开用户的设备
- **速度**：避免了网络传输延迟
- **离线可用**：一旦模型加载完成，可在离线状态下使用
- **跨平台**：支持所有现代浏览器

通过使用 WebAssembly + ONNX Runtime Web，我们可以在浏览器中高效运行 AI 模型，为用户提供快速、隐私的背景移除功能。