# Super Field - Slider

An interactive slider input component for Budibase applications with multiple visual styles, range controls, and precise value selection.

## 🚀 Features

### Slider Types

- **Standard Slider**: Classic horizontal slider interface
- **Ticks Slider**: Slider with tick marks for discrete values
- **Ramp Slider**: Visual ramp-style slider with gradient
- **Filled Display**: Optional filled track visualization
- **Step Control**: Configurable step increments

### Value Configuration

- **Range Settings**: Custom minimum and maximum values
- **Default Values**: Pre-set slider positions
- **Step Increments**: Control precision and allowed values
- **Real-time Updates**: Immediate value feedback
- **Number Field Binding**: Dedicated numeric field integration

### Visual Customization

- **Tick Marks**: Visual indicators for value steps
- **Tick Labels**: Numeric labels on tick marks
- **Filled Track**: Visual progress indication
- **Disabled State**: Clear disabled appearance
- **Theme Integration**: Consistent with Budibase design

### User Experience

- **Intuitive Interaction**: Drag or click to set values
- **Keyboard Support**: Arrow key navigation and direct input
- **Accessibility**: Screen reader support and ARIA labels
- **Responsive Design**: Touch-friendly on mobile devices
- **Visual Feedback**: Clear value indication and changes

### Advanced Features

- **Precise Control**: Fine-grained value selection
- **Validation**: Range and step validation
- **Event Handling**: Value change event triggers
- **Conditional Logic**: Dynamic behavior based on slider values
- **Data Binding**: Two-way data synchronization

## 📝 Usage Instructions

### Basic Setup

1. Add the Super Field - Slider component to your form
2. Bind to a number field in your data source
3. Set minimum and maximum values
4. Configure step size and default value

### Advanced Configuration

- **Slider Type**: Choose appropriate visual style
- **Tick Configuration**: Add tick marks and labels for precision
- **Range Settings**: Define value boundaries
- **Visual Options**: Enable filled display and styling

### Common Use Cases

- **Rating Systems**: User satisfaction or quality ratings
- **Volume Controls**: Audio or display brightness settings
- **Quantity Selection**: Product quantities or percentages
- **Parameter Adjustment**: Configuration and preference settings
- **Progress Indication**: Completion percentage inputs

## 🔧 Configuration Options

| Setting       | Type    | Description                  |
| ------------- | ------- | ---------------------------- |
| Field         | Number  | Numeric field binding        |
| Label         | String  | Display label text           |
| Default Value | Number  | Pre-set slider value         |
| Slider Type   | Select  | Standard/Ticks/Ramp style    |
| Tick Size     | Number  | Spacing between tick marks   |
| Tick Labels   | Boolean | Show numeric labels on ticks |
| Min Value     | Number  | Minimum slider value         |
| Max Value     | Number  | Maximum slider value         |
| Step          | Number  | Value increment size         |
| Disabled      | Boolean | Disable slider interaction   |
| Filled        | Boolean | Show filled track style      |

## 📋 Events

### On Change

Triggered when slider value changes.

**Context:**

- `value`: Current slider value
- `field`: The bound field information

## 🎨 Styling

The component supports Budibase's styling system with:

- **Track Styling**: Custom track and handle appearance
- **Color Theming**: Consistent color application
- **Size Variants**: Different slider sizes
- **Custom CSS**: Advanced visual modifications

## 🔍 Best Practices

- Set appropriate min/max values for your use case
- Use tick marks for discrete value selection
- Consider step size for precision requirements
- Enable filled style for progress-like sliders
- Test slider interaction on touch devices
- Provide clear labels for value meaning
