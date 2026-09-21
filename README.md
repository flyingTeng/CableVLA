# CableVLA

**Simulation-Privileged Global–Local Representation Learning for Cable Routing**

CableVLA is a multimodal vision–language–action framework for robotic cable routing. It learns representations of global cable topology and local contact dynamics from simulation-privileged supervision, then uses causal sensor observations to support action generation and refinement at deployment.

**This repository is the public release of the TacSense component of CableVLA.** The current initial commit provides the project overview; implementation, pretrained weights, and runnable examples are not yet included.

## Overview

Routing a flexible cable requires both an understanding of its overall configuration and sensitivity to changing contacts. Visual observations provide context about the route and surrounding obstacles, while tactile histories reveal local loading, motion, and slip at the cable–gripper interface.

The CableVLA framework described in the paper brings together:

- **TopoHead:** a temporal visual representation of cable topology, learned with privileged physical supervision and teacher–student distillation.
- **TacSense:** a dual-branch tactile encoder that captures whole-field temporal evolution and taxel-local contact dynamics.
- **Contact-gated action refinement:** a local pathway that combines tactile and wrist-wrench features to refine actions from a frozen topology-conditioned policy when recent contact is detected.

The scope of this public release is **TacSense**. TopoHead, the full VLA policy, wrist-wrench and residual-control modules, and the complete robot deployment stack are outside this release.

## TacSense

TacSense turns a short history of resistive tactile-array measurements into a compact contact representation. Simulation supplies physical states, contact kinematics, and event labels during training; the deployed tactile encoder consumes tactile observations and their validity masks without requiring privileged simulator states.

### Dual-branch representation

The paper uses an **8 × 12 tactile array**, a **25-frame history**, and a **128-dimensional output per finger**.

| Component | Role |
| --- | --- |
| Frame branch | Models temporal changes across the complete tactile field and summarizes them with learned pooling queries. |
| Taxel branch | Models each taxel's temporal dynamics, then combines taxel identity, spatial coordinates, and interactions across the array. |
| Fusion module | Combines the two branch summaries into a shared 128-dimensional representation. |

The same encoder weights process the left and right fingers independently, producing two tactile representations for downstream use. Input normalization is fitted on training data, and observation-validity masks distinguish valid measurements from missing observations.

### Learning contact dynamics

TacSense is trained with **57 tasks across six capability families**:

| Family | Capability | Tasks |
| --- | --- | ---: |
| A | Contact and transitions | 15 |
| B | Motion and loading | 8 |
| C | Slip-related events | 13 |
| D | Contact-patch spatial and shape changes | 7 |
| E | Continuous physical state | 6 |
| F | Orientation and geometry | 8 |

Supervision combines quantities derived from tactile maps with simulator contact records, relative kinematics, and future trajectories. These signals support learning events such as slip onset and cessation, rotational slip, rolling, and transitions from rolling to sliding.

Two auxiliary objectives complement the task supervision:

- **Spatial infilling (G1):** reconstruct valid measurements at taxels masked throughout the input history.
- **Future tactile-change prediction (G2):** predict the presence, sign, and ordinal magnitude of tactile changes over the next 10 frames.

Training readouts access the 128-dimensional representation and are removed for deployment. The exported representation is intended to retain information useful for contact recognition and downstream control.

## Release Status

| Item | Availability |
| --- | --- |
| CableVLA overview and TacSense method description | Included in this README |
| TacSense source code and configuration files | Not yet included |
| Pretrained TacSense weights | Not yet included |
| Training, evaluation, and inference instructions | Not yet included |
| Datasets and data preparation tools | Not yet included |
| Full CableVLA policy and non-TacSense modules | Outside the scope of this release |

Installation and usage instructions will accompany the corresponding implementation. This initial repository does not yet provide a runnable reproduction of the paper's experiments.

## Paper

**CableVLA: Simulation-Privileged Global–Local Representation Learning for Cable Routing**

Zhifei Teng\*, Bo Feng\*, Xiang Zou, Jinpeng Xiao, Min Li, Zhouping Yin, and Yiqun Li.

\* Equal contribution.

Paper links and citation metadata will be added when a public paper URL is available.
