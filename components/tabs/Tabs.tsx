import * as React from 'react';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import styles from './style/';
import TabsProps from './TabsProps';

class Tabs extends React.Component<TabsProps, any> {
  static defaultProps = {
    tabPosition: 'top',
    animation: true,
    onChange() {},
    onTabClick() {},
    underlineColor: '#ddd',
    activeUnderlineColor: '#108ee9',
    textColor: '#000',
    activeTextColor: '#108ee9',
    styles: styles,
  };

  static TabPane: any;
  activeIndex: number;

  constructor(props) {
    super(props);
    this.activeIndex = 0;
  }

  onTabClick = ({i}) => {
    const key = this.getKey(i);
    const { onTabClick, onChange } = this.props;
    onTabClick(key);
    if (this.activeIndex !== i) {
      onChange(key);
      this.activeIndex = i;
    }
  }

  getContents() {
    const { children } = this.props;
    const newChildren = [];
    React.Children.forEach(children, (child: any, idx) => {
      newChildren.push(React.cloneElement(child, {
        key: idx,
        tabLabel: child.props.tab,
        children: child.props.children,
      }));
    });

    return newChildren;
  }

  getKey(index) {
    const children = this.props.children;
    let key;
    React.Children.forEach(children, (child: any, idx) => {
      if (index === idx) {
        key = child.key;
      }
    });
    return key;
  }

  renderTabBar = (props) => {
    const {
      tabPosition, underlineColor, activeUnderlineColor, textColor, activeTextColor, styles,
    } = this.props;
    // TODO PR: react-native-scrollable-tab-view@0.6.0 support underlineStyle
    // remove DefaultTabBar underlineHeight & underlineColor props
    // use borderColor
    const barStyle = tabPosition === 'top' ? [styles.barTop, {
      borderBottomColor: underlineColor,
    }] : [styles.barBottom, {
      borderTopColor: underlineColor,
      borderBottomColor: 'transparent',
    }];
    return (
      <DefaultTabBar
        underlineHeight={2}
        underlineColor={activeUnderlineColor}
        activeTextColor={activeTextColor}
        inactiveTextColor={textColor}
        style={barStyle}
        textStyle={[styles.text]}
        tabStyle={[styles.tab]}
        underlineStyle={[styles.underline, {
          bottom: tabPosition === 'top' ? 0 : null,
          backgroundColor: activeUnderlineColor,
        }]}
      />
    );
  }

  render() {
    const {
      tabPosition, defaultActiveKey, activeKey, animation, children,
    } = this.props;

    let defaultActiveIndex = 0;
    let activeIndex = 0;
    React.Children.forEach(children, (child: any, idx) => {
      if (defaultActiveKey === child.key) {
        defaultActiveIndex = idx;
      }
      if (activeKey === child.key) {
        activeIndex = idx;
      }
    });

    this.activeIndex = activeIndex;

    return (
      <ScrollableTabView
        tabBarPosition={tabPosition}
        scrollWithoutAnimation={!animation}
        initialPage={defaultActiveIndex}
        page={activeIndex}
        renderTabBar={this.renderTabBar}
        onChangeTab={this.onTabClick}
      >
        {this.getContents()}
      </ScrollableTabView>
    );
  }
}

export default Tabs;